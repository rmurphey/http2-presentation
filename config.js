var path = require('path');

module.exports = {
  KEY_FILE: path.join(__dirname, 'keys/localhost.key'),
  CERT_FILE: path.join(__dirname, 'keys/localhost.crt'),
  CA: []
}
