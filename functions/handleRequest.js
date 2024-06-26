const endpointsPath = "../resources/endpoints.json";
let endpoints = require(endpointsPath);
const serverConfigPath = "../serverConfig.json";
let serverConfig = require("../serverConfig.json");

let httpResponse = require("../functions/httpResponse.js");
const fs = require('fs');
const PATH = require('path');
const log = require('../functions/logger.js');

module.exports = function handleRequest(data) {
  const request = data.toString();

  console.log("\n\n", request, "\n\n");

  const parts = request.split("\r\n\r\n");
  const bodyParts = parts[0].split("\r\n");
  const headersString = bodyParts.slice(2).join("\r\n");
  const headers = parseHeaders(headersString); 
  const content = parts[1];

  const requestLine = bodyParts.shift().split(" ");
  const method = requestLine[0];
  const path = requestLine[1];

  const paths = path.substring(1).split("/");

  console.log("Method:\n", method, "\nPath:\n", path.substring(1), "\nHeaders:\n" + JSON.stringify(headers, null, 2), "\nContent:\n", content);
  console.log();

  let newContent = "";
  let numCode = "200 OK";

  // Check if the API_KEY is valid
  if (!validateApiKey(headers)) {
    numCode = "401 Unauthorized";
    newContent = "Invalid API key.";
    return httpResponse(numCode, "application/json", newContent);
  }

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
          // Retrieve the list of image names in the "resources" folder
          const fs = require('fs');
          const resourcePath = './resources';
          let imageNames = [];
      
          fs.readdirSync(resourcePath).forEach(file => {
              if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.gif')) {
                  imageNames.push(file);
              }
          });
      
          // Create a message with the image names
          newContent = "Endpoints:\n" + JSON.stringify(endpoints, null, 2) + "\n\nImages in 'resources' folder:\n" + imageNames.join("\n");
        } else if (endpoint in endpoints) {
          newContent = JSON.stringify(endpoints[endpoint], null, 2);
        } else if (headers["Content-Type"] && headers["Content-Type"].startsWith("image/")) {
          const imageExtension = headers['Content-Type'].split('/')[1];
          const imagePath = PATH.join(__dirname, '..', 'resources', endpoint + "." + imageExtension);
          if (fs.existsSync(imagePath)) {
            newContent = fs.readFileSync(imagePath, 'binary');
            return httpResponse(numCode, headers["Content-Type"], newContent);
          } else {
            numCode = "404 Not Found";
            newContent = "The image " + endpoint + " doesn't exist.";
          }
        } else {
          numCode = "404 Not Found";
          newContent = "The endpoint " + endpoint + " doesn't exist.";
        }
        break;
      }
      case "POST": {
        if (headers["Content-Type"] && headers["Content-Type"].startsWith("image/")) {
          try {
            const imageExtension = headers['Content-Type'].split('/')[1];
            const imageFileName = `${paths[0]}.${imageExtension}`;
            const imagePath = PATH.join(__dirname, '..', 'resources', imageFileName);
        
            // Check if the image file already exists
            if (fs.existsSync(imagePath)) {
              numCode = "409 Conflict";
              newContent = "The image file already exists.";
            } else {
              // Save the image file to the server's resources folder
              fs.writeFileSync(imagePath, content, 'binary');
        
              numCode = "201 Created";
              newContent = "Image uploaded successfully.";
            }
          } catch (e) {
            numCode = "400 Bad Request";
            newContent = e.message;
          }
        } else {
          if (endpoint in endpoints) {
            numCode = "409 Conflict";
            newContent = "The endpoint " + endpoint + " already exists.";
          } else {
            let etag = headers["Etag"] || "";
            let language = headers["Content-Language"] || "";
            let content_type = headers["Content-Type"] || "";
            endpoints[endpoint] = { 
              "content": content,
              "content_type": content_type,
              "etag": etag,
              "time_modify": new Date(),
              "language": language
            };
            // Save the updated JSON to file

            const endpointsPath = PATH.join(__dirname, '..', 'resources', "endpoints.json");

            fs.writeFileSync(endpointsPath, JSON.stringify(endpoints, null, 2));
            numCode = "201 Created";
            newContent = "the endpoint " + endpoint + " added successfully";
          }
        }
        break;
      }
      case "PUT": {
        if (endpoint in endpoints) {
          let etag = headers["Etag"] || "";
          let language = headers["Content-Language"] || "";
          let content_type = headers["Content-Type"] || "";
          endpoints[endpoint] = { 
            "content": content,
            "content_type": content_type,
            "etag": etag,
            "time_modify": new Date(),
            "language": language
          };

          const endpointsPath = PATH.join(__dirname, '..', 'resources', "endpoints.json");

          fs.writeFileSync(endpointsPath, JSON.stringify(endpoints, null, 2));
          newContent = "Endpoint " + endpoint + " modified successfully.";
        } else {
          numCode = "404 Not Found";
          newContent = "The endpoint " + endpoint + " doesn't exist.";
        }
        break;
      }
      case "DELETE": {
        if (headers["Content-Type"] && headers["Content-Type"].startsWith("image/")) {
          const imageExtension = headers['Content-Type'].split('/')[1];
          const imagePath = PATH.join(__dirname, '..', 'resources', endpoint + "." + imageExtension);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            newContent = "The image " + endpoint + " deleted successfully.";
          } else {
            numCode = "404 Not Found";
            newContent = "The image " + endpoint + " doesn't exist.";
          }
        } else if (endpoint in endpoints) {
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
  const response = httpResponse(numCode, "application/json", newContent);
  return response;
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

function validateApiKey(headers) {
  const apiKey = headers["API_KEY"];
  return serverConfig.API_KEYS.includes(apiKey);
}

// Watch for changes in the serverConfig.json file
fs.watch(PATH.join(__dirname, serverConfigPath), (eventType, filename) => {
  if (eventType === 'change') {
    console.log('serverConfig.json file changed. Reloading...');
    delete require.cache[require.resolve(serverConfigPath)];
    serverConfig = require(serverConfigPath);
    console.log('serverConfig reloaded successfully.');
  }
});
