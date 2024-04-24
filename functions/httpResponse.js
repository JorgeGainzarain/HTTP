module.exports = function buildHttpResponse(statusCode, contentType, content) {
    const contentLength = content ? Buffer.byteLength(content) : 0;
    return `HTTP/1.1 ${statusCode}\r\n` +
           `Content-Type: ${contentType}\r\n` +
           `Content-Length: ${contentLength}\r\n` +
           `\r\n` +
           `${content || ''}`;
}