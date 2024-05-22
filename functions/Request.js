module.exports = async function getRequest(host, method, path) {
    const readline = require("readline");
    const config = require("../config.json");
    const validMethods = config.httpMethods;
    const PATH = require('path');
    const fs = require('fs');
    let headers = {};
    let uploadImage = false;
    method = method.toUpperCase(); // Convert method to uppercase in case it was lowercase
  
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Initialize headers based on the HTTP method
    switch (method) {
      // POST or PUT
      case "POST": {
        // Prompt for image upload option
        uploadImage = await new Promise((resolve) => {
            rl.question("Do you want to upload an image? (Y/N): ", (answer) => {
            resolve(answer.toLowerCase() === 'y');
            });
        });
      }
      case "PUT": {
        if(!uploadImage) {
            headers = { ...config.headers.POST };
        }
        break;
      }
  
      // GET or HEAD
      case "GET":
      case "HEAD": {
        headers = { ...config.headers.GET };
        break;
      }
  
      // DELETE 
      case "DELETE": {
        headers = { ...config.headers.DELETE };
        break;
      }
    }
  
    if (!validMethods.includes(method)) {
      throw new Error(`Unsupported HTTP method: ${method}`);
    } else {

      let message = "API_KEY:" + config.API_KEY + "\r\n";
      if(config.cookie != ""){
        message += "Cookie:" + config.cookie + "\r\n";
      }
      // Prompt for headers
      while (Object.keys(headers).length > 0) {
        console.log("Available headers for the method", method, ":\n");
        let extra = "";
        let i = 0;
        let aux = [];
        for (k in headers) {
          i++;
          aux.push(k);
          console.log(i, k, ":", headers[k]);
        }
        aux.push("");
        console.log(i + 1, "Finish");
  
        let selectedHeader = "";
        while (true) {
          const answer = await new Promise((resolve) => {
            rl.question("\nSelect a header\n:", (answer) => {
              resolve(answer);
            });
          });
  
          if (answer === (i + 1).toString()) {
            selectedHeader = "";
            break;
          }
  
          const selectedIndex = parseInt(answer);
          if (selectedIndex >= 1 && selectedIndex <= i) {
            selectedHeader = aux[selectedIndex - 1];
            break;
          } else {
            console.log("Invalid option. Please try again.");
          }
        }
  
        if (selectedHeader !== "") {
          extra = await new Promise((resolve) => {
            rl.question("Value for the header:", (answer) => {
              resolve(": " + answer);
            });
          });
        } else {
          break;
        }
        message += selectedHeader + extra + "\r\n";
        delete headers[selectedHeader];
      }
  
      // Prompt for content for POST or PUT method
      if (method === "POST" || method === "PUT") {
        
        if (uploadImage) {
            // Delete the Content-Type header if existing to add the image/Content-Type
            message = deleteContentTypeHeader(message);
          
            const imagePath = await new Promise((resolve) => {
              rl.question("Enter the path of the image file to upload:\n", (answer) => {
                resolve(answer);
              });
            });
          
            const imageData = fs.readFileSync(PATH.join(__dirname, ".." , 'clientResources', imagePath), 'binary');
            const imageContentType = `image/${PATH.extname(imagePath).slice(1)}`;
          
            // Automatically set Content-Type for images
            message += `Content-Type: ${imageContentType}\r\n`;
          
            // Append image data to the request body
            message += `\r\n${imageData}\r\n`;
        }
        else {
            const content = await new Promise((resolve) => 
            {
                rl.question("Enter content:\n", (answer) => {
                    resolve(answer);
                });
            });
            message += "\r\n" + content + "\r\n";
        }
      }
  
      rl.close();
      return `${method} ${path} HTTP/1.1\r\nHost: ${host}\r\n${message}\r\n`;
    }
  }

  function deleteContentTypeHeader(message) {
    // Use a regular expression to match the entire Content-Type header row
    const contentTypeRegex = /Content-Type:.*\r?\n/;
  
    // Check if the Content-Type header exists
    if (contentTypeRegex.test(message)) {
      // Replace the Content-Type header row with an empty string to delete it
      return message.replace(contentTypeRegex, '');
    }
  
    // If Content-Type header doesn't exist, return the original message
    return message;
  }