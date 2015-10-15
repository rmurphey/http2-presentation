'use strict';

var fs = require('fs');
var path = require('path');
var https = process.env.H2 ? require('http2') : require('https');
var log = require('./lib/log').createLogger('request')
var qs = require('querystring');

var KEY_FILE = path.join(__dirname, 'keys/localhost.key');
var CERT_FILE = path.join(__dirname, 'keys/localhost.crt');
var PORT = process.env.PORT || 9000;

function send (filename, response, isPush) {
  if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    let fileStream = fs.createReadStream(filename);
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
  log.info(request.method, `HTTP/${request.httpVersion}`, request.scheme, request.url);

  let parts = request.url.split('?');
  let query = qs.parse(parts[1]);
  let filename = path.join(__dirname, 'static', parts[0]);

  // push(request, response);
  if (query.push && response.push) {
    let pushFilename = path.join(__dirname, 'static', query.push);
    let pushResponse = response.push(query.push);
    log.info('attempting push', query.push);
    send(pushFilename, pushResponse);
  }

  return send(filename, response);
}

https.createServer({
  key : fs.readFileSync(KEY_FILE),
  cert : fs.readFileSync(CERT_FILE)
}, onRequest).listen(PORT);
