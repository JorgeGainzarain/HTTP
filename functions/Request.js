module.exports = async function getRequest(host, method, path) {
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

    let message = "";

    while(Object.keys(headers).length > 0) {
      console.log("Avaiable headers for the method ", method, ":\n");
      let extra = "";
      let i = 0;
      let aux = [];
      let header = "";
      for (k in headers) {
        i++;
        aux.push(k);
        console.log(i, k, ":", headers[k]);
      }
      aux.push("");
      console.log(i+1, "Finish")
      
      
      header = await new Promise((resolve) => {
        rl.question("\nSelect a header\n:", (answer) => {
          let selectedHeader = aux[parseInt(answer) - 1]; // Adjust index to array index
          resolve(selectedHeader);
        });
      });
      
      if (header !== "") {
        extra = await new Promise((resolve) => {
          rl.question("Value for the header:", (answer) => {
            resolve(": " + answer);
          });
        });
      }
      else {
        break;
      }
      message += header + extra + "\r\n";
      delete headers[header];
    }

    //console.log(`${method} ${path} HTTP/1.1\r\nHost: ${host}\r\n${header}${extra}\r\n`);

    rl.close();
    return `${method} ${path} HTTP/1.1\r\nHost: ${host}\r\n${message}}\r\n\r\n`;

  }
}