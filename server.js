const net = require("net");
const handleRequest = require("./functions/handleRequest.js")
const port = 80;

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
