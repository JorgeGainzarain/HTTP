const fs = require('fs');
const path = require('path');

function log(level, message) {
  const logMessage = `${new Date().toISOString()} [${level.toUpperCase()}]: ${message}\n`;
  fs.appendFileSync(path.join(__dirname, 'server.log'), logMessage, 'utf8');
}

module.exports = log;