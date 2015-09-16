var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

var logOutput = process.stderr;

if (process.stderr.isTTY) {
  var bin = path.resolve(path.dirname(require.resolve('bunyan')), '..', 'bin', 'bunyan');
  if (bin && fs.existsSync(bin)) {
    logOutput = spawn(bin, ['-o', 'short'], {
      stdio: [null, process.stderr, process.stderr]
    }).stdin;
  }
}

exports.createLogger = function(name) {
  return require('bunyan').createLogger({
    name: name,
    stream: logOutput,
    level: process.env.HTTP2_LOG || 'debug',
    serializers: require('http').serializers
  });
};
