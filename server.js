const net = require("net");
const handleRequest = require("./functions/handleRequest.js")
const readline = require("readline");
const log = require('./functions/logger.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

new Promise((resolve) => {
  const askPort = () => {
      rl.question("Select the port: (Empty for default 80) :", (answer) => {
          if (answer === "") {
              resolve(80); // Default port 80
          } else if (isNaN(answer)) {
              console.log("Please enter a valid number.");
              askPort(); // Repeat the question
          } else {
              resolve(parseInt(answer)); // Convert answer to number and resolve the promise
          }
      });
  };

  askPort(); // Start asking for the port
})

.then((port) => {
  const server = net.createServer((socket) => {
    log('Client_Start', 'Client connected\n');
    console.log("Client connected");
  
    socket.on("data", (data) => {
      const response = handleRequest(data);
      log('REQUEST', `Received request: ${data}`);
      //console.log("\n\n", response, "\n\n");
      socket.write(response);
      log('REQUEST', `Sent response: ${response}`);
    });
  
    socket.on("error", (err) => {
      if (err.code === 'ECONNRESET') {
        console.error("Client connection reset by peer");
      } else {
        console.error("Socket error:", err);
      }
      socket.end();
    });

    socket.on("end", () => {
      console.log("Client disconnected");
      log('Client_END', 'Client disconnected');
    });
  });
  
  server.listen(port, () => {
    log('START', `Server listening on port ${port}`);
    console.log("Server listening on port ", port);
  });
})
