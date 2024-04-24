let endpoints = require("../endpoints.json");

module.exports = function handleRequest(data) {
    let message = "";

    const request = data.toString();
    const body = request.substring(0, request.length - 4);
    const parts = body.split("\r\n");
    const parts1 = parts[0].split(" ");
    const method = parts1[0];
    const path = parts1[1];

    const paths = path.substring(1).split("/");

    let err = "";
    let numErr = 0;

    if (paths.length > 1) {
        // ERR PATH
        return;
    }

    let endpoint = paths[0];

    switch (method) {
  
      case "GET" : 
      case "HEAD" : {
        if (path == "/") {
            // STATIC 
        }
        else if (endpoint in endpoints) {
            // SHOW IT
        }
        else {
          numErr = 404;
          err = "The endpoint " + endpoint + " doesn't exists." 
        }
      }
      break;
  
      case "POST" : {
        if (!endpoint in endpoints) {
            // ADD IT
        }
        else {
          numErr = 409;
          err = "The endpoint " + endpoint + " already exists."
        }
      }
      
      break;
  
      case "PUT" : {
        if (endpoint in endpoints) {
            // MODIFY
        }
        else {
          numErr = 404;
          err = "The endpoint " + endpoint + " doesn't exists." 
        }
      }
  
      break;
      
      case "DELETE" : {
        if (endpoint in endpoints) {
            // DELETE
        }
        else {
          numErr = 404;
          err = "The endpoint " + endpoint + " doesn't exists." 
        }
      }
  
    }  

    if (err != "") {
      message = `HTTP/1.1 Error: ${numErr}\r\n` +
      `Content-Type: application/json\r\n` +
      `Content-Length: ${JSON.stringify({ message: err }).length}\r\n` +
      `\r\n` +
      `{"message": "${err}"}`;
    }
    
  
    return message;
  };


  