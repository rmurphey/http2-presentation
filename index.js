var fs = require('fs');
var path = require('path');
var http2 = require('http2');
var http1 = require('https');
var log = require('./lib/log').createLogger('request')

var KEY_FILE = path.join(__dirname, 'keys/localhost.key');
var CERT_FILE = path.join(__dirname, 'keys/localhost.crt');

function onRequest (request, response) {
  var filename = path.join(__dirname, 'static', request.url);
  log.info(request.url, filename);

  if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    var fileStream = fs.createReadStream(filename);
    response.writeHead(200);
    fileStream.pipe(response);
    fileStream.on('finish', response.end);
  }

  // Otherwise responding with 404.
  else {
    response.writeHead(404);
    response.end();
  }
}

http2.createServer({
  key : fs.readFileSync(KEY_FILE),
  cert : fs.readFileSync(CERT_FILE)
}, onRequest).listen(9000);

http1.createServer({
  key : fs.readFileSync(KEY_FILE),
  cert : fs.readFileSync(CERT_FILE)
}, onRequest).listen(9001);
