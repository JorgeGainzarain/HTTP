const net = require("net");
const handleRequest = require("./functions/handleRequest.js")
const readline = require("readline");

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
    console.log("Client connected");
  
    socket.on("data", (data) => {
      const response = handleRequest(data);
      //console.log("\n\n", response, "\n\n");
      socket.write(response);
    });
  
    socket.on("end", () => {
      console.log("Client disconnected");
    });
  });
  
  server.listen(port, () => {
    console.log("Server listening on port ", port);
  });
})

