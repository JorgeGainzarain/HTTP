const endpointsPath = "../endpoints.json"

let endpoints = require(endpointsPath);
let httpResponse = require("../functions/httpResponse.js");
const fs = require('fs');

module.exports = function handleRequest(data) {
  const request = data.toString();

  console.log("\n\n", request, "\n\n");

  const parts = request.split("\r\n\r\n");
  const bodyParts = parts[0].split("\r\n");
  const headersString = bodyParts.slice(2).join("\r\n"); // Join the headers into a single string
  const headers = parseHeaders(headersString); // Parse the headers into JSON format
  const content = parts[1];

  const requestLine = bodyParts.shift().split(" ");
  const method = requestLine[0];
  const path = requestLine[1];

  const paths = path.substring(1).split("/");

  
  console.log("Method:\n", method, "\nPath:\n", path.substring(1), "\nHeaders:\n" + JSON.stringify(headers, null, 2), "\nContent:\n", content);
  console.log();

  let newContent = "";
  let numCode = "200 OK";

  if (paths.length > 1) {
      numCode = "404 Not Found";
      newContent = "The endpoint " + path + " doesn't exist.";
  } else {
      const endpoint = paths[0];

      switch (method) {
          case "GET":
          case "HEAD": {
              if (path === "/") {
                  newContent = fs.readFileSync('static.html', 'utf8');
              } else if (path === "/list") {
                  newContent = JSON.stringify(endpoints, null, 2);
              } else if (endpoint in endpoints) {
                  newContent = JSON.stringify(endpoints[endpoint], null, 2);
              } else {
                  numCode = "404 Not Found";
                  newContent = "The endpoint " + endpoint + " doesn't exist.";
              }
              break;
          }

          case "POST": {
            if (endpoint in endpoints) {
              numCode = "409 Conflict";
              newContent = "The endpoint " + endpoint + " already exists.";
            } 
            else {
              let etag = headers["Etag"] || "";
              let language = headers["Content-Language"] || "";
              let content_type = headers["Content-Type"] || "";

              // Store the content directly
              endpoints[endpoint] = { 
                "content": content,
                "content_type": content_type,
                "etag": etag,
                "time_modify": new Date(),
                "language": language
              };
              // Save the updated JSON to file
              fs.writeFileSync("endpoints.json", JSON.stringify(endpoints, null, 2));
              newContent = "the endpoint " + endpoint + " added succesfully";
            }
            break;
          }
        

          case "PUT": {
              if (endpoint in endpoints) {
                  endpoints[endpoint] = JSON.parse(content);
                  newContent = "Endpoint " + endpoint + " modified successfully.";
              } else {
                  numCode = "404 Not Found";
                  newContent = "The endpoint " + endpoint + " doesn't exist.";
              }
              break;
          }

          case "DELETE": {
              if (endpoint in endpoints) {
                  delete endpoints[endpoint];
                  newContent = "Endpoint " + endpoint + " deleted successfully.";
              } else {
                  numCode = "404 Not Found";
                  newContent = "The endpoint " + endpoint + " doesn't exist.";
              }
              break;
          }

          default: {
              numCode = "405 Method Not Allowed";
              newContent = "Method " + method + " is not allowed.";
          }
      }
  }

  return httpResponse(numCode, "application/json", newContent);
};


function parseHeaders(headersString) {
    if (!headersString) {
      return {}; 
    }
    
    const headersArray = headersString.split("\r\n").map(header => header.split(":"));
    const headers = {};
    headersArray.forEach(([key, value]) => {
      headers[key.trim()] = value.trim();
    });
    return headers;
  }