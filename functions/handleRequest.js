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
            message = "Error: the endpoint " + endpoint + " doesn't exists." 
        }
      }
      break;
  
      case "POST" : {
        if (!endpoint in endpoints) {
            // ADD IT
        }
      }
      
      break;
  
      case "PUT" : {
        if (endpoint in endpoints) {
            // MODIFY
        }
      }
  
      break;
      
      case "DELETE" : {
        if (endpoint in endpoints) {
            // DELETE
        }
      }
  
    }  
  
    return message;
  };


  