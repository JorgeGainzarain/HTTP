module.exports = function getRequest(host, method, path) {
  const readline = require("readline");
  const config = require("../config.json");
  const validMethods = config.httpMethods
  let headers;
  method = method.toUpperCase(); // Convert method to uppercase in case it was lowercase

  if (!validMethods.includes(method)) {
    throw new Error(`Unsupported HTTP method: ${method}`);
  }
  else {
    switch(method) {
      // POST or PUT
      case "POST": 
      case "PUT": {
        headers = config.headers.POST;
      }
      break;

      // GET or HEAD
      case "GET" :
      case "HEAD": {
        headers = config.headers.GET;
      }
      break;

      // DELETE 
      case "DELETE": {
        headers = config.headers.DELETE;
      }
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("Avaiable headers for the method ", method, ":\n");
    let i = 0;
    let aux = [];
    let header;
    for (k in headers) {
      i++;
      aux.push(k);
      console.log(i, k, ":", headers[k]);
    }
    rl.question("Select a header\n:", (answer) => {
      if(answer > aux.lenght) {
        header = "";
      }
      else {
        header = aux[answer];
      }
    });
    rl.question("Value for the header:", (answer) => {
      return `${method} ${path} HTTP/1.1\r\nHost: ${host}\r\n${header} ${answer}\r\n`;
    })

    
  }
}
