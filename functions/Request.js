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

    extra = await showHeaders()

    //console.log(`${method} ${path} HTTP/1.1\r\nHost: ${host}\r\n${header}${extra}\r\n`);

    rl.close();
    return `${method} ${path} HTTP/1.1\r\nHost: ${host}\r\n${header}${extra}\r\n\r\n`;

  }
}

async function showHeaders() {
  console.log("Avaiable headers for the method ", method, ":\n");
  let i = 0;
  let aux = [];
  let header = "";
  let extra = "";
  for (k in headers) {
    i++;
    aux.push(k);
    console.log(i, k, ":", headers[k]);
  }
  aux.push("");
  console.log(i+1, "None")
  
  
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
    extra = "";
  }
}