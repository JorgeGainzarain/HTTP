module.exports = function getRequest(host, method, path) {
  const validMethods = require("../config.json").httpMethods
  method = method.toUpperCase(); // Convert method to uppercase in case it was lowercase

  if (!validMethods.includes(method)) {
    throw new Error(`Unsupported HTTP method: ${method}`);
  }
  else {
    return `${method} ${path} HTTP/1.1\r\nHost: ${host}\r\n\r\n`;
  }
}
