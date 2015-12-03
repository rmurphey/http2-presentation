'use strict';

var fs = require('fs');
var path = require('path');
var server = (process.env.H2 ? require('spdy') : require('https')).createServer;
var h2 = require('http2');
var log = require('./lib/log').createLogger(process.env.H2 ? 'h2' : 'h1');
var qs = require('querystring');
var gzip = require('zlib').createGzip();
var config = require('./config');

const PORT = process.env.PORT || 9000;

var maxAge = {
  '/common/main.js' : 600,
  '/common/libs/combined.js.gz' : 600
};

var contentTypes = {
  html : 'text/html',
  js : 'application/javascript'
};

function send (filename, response, resource, cb) {
  if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    let fileStream = fs.createReadStream(filename);

    if (maxAge[resource] !== undefined) {
      response.setHeader('Cache-Control', `max-age=${maxAge[resource]}`)
    }

    console.log(path.parse(resource).ext);

    response.setHeader(
      'Content-Type',
      contentTypes[path.parse(resource).ext.replace('.', '')]
    );

    if (filename.match(/\.gz$/)) {
      response.setHeader('Content-Encoding', 'gzip');
    }

    response.writeHead(200);

    fileStream.pipe(response);
    fileStream.on('finish', response.end);

    return true;
  }

  response.writeHead(404);
  response.end();

  return false;
}

function onRequest (request, response) {
  log.info(request.method, `HTTP/${request.httpVersion}`, request.url);

  let parts = request.url.split('?');
  let query = qs.parse(parts[1]);
  let url = parts[0];
  let filename = path.join(__dirname, 'static', url);

  send(filename, response, url, cb);

  if (query.push && response.push) {
    let pushFilename = path.join(__dirname, 'static', query.push);
    let pushStream = response.push(query.push, {
      request : {
        accept : '*/*'
      },
      response : {
        'Content-Type' : contentTypes[path.parse(query.push).ext.replace('.', '')] || 'text/html'
      }
    });

    fs.createReadStream(pushFilename).pipe(pushStream);
  }
}

server({
  key : config.KEY_FILE,
  cert : config.CERT_FILE,
  ca: config.CA,
  spdy : {
    protocols : [ 'h2', 'http/1.1' ]
  }
}, onRequest).listen(PORT);

log.info(`${process.env.H2 ? 'HTTP/2 (node-spdy)' : 'HTTP/1.1'} server running on https://localhost:${PORT}`);
