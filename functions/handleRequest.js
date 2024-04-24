let endpoints = require("../endpoints.json");
let httpResponse = require("../functions/httpResponse.js");

module.exports = function handleRequest(data) {

    const request = data.toString();
    const body = request.substring(0, request.length - 4);
    const parts = body.split("\r\n");
    const parts1 = parts[0].split(" ");
    const method = parts1[0];
    const path = parts1[1];

    const host = parts[1].split(" ")[1];
    console.log(host);

    const paths = path.substring(1).split("/");

    let content = "";
    let numCode = "200 OK";

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
        else if (path == "/list") {
          content = JSON.stringify(endpoints, null, 2);
        }
        else if (endpoint in endpoints) {
          content = JSON.stringify(endpoints[endpoint], null, 2);
        }
        else {
          numCode = "Error: 404";
          content = "The endpoint " + endpoint + " doesn't exists." 
        }
      }
      break;
  
      case "POST" : {
        if (endpoint in endpoints) {
          numCode = 409;
          content = "The endpoint " + endpoint + " already exists."
        }
        else {
          // ADD IT
        }
      }
      
      break;
  
      case "PUT" : {
        if (endpoint in endpoints) {
            // MODIFY
        }
        else {
          numCode = 404;
          content = "The endpoint " + endpoint + " doesn't exists." 
        }
      }
  
      break;
      
      case "DELETE" : {
        if (endpoint in endpoints) {
            // DELETE
        }
        else {
          numCode = 404;
          content = "The endpoint " + endpoint + " doesn't exists." 
        }
      }
  
    }  
    
    return httpResponse(numCode, "application/json", content)
  };


  