const net = require("net");
const menu = require("./functions/Menu.js")
const selectHost = require("./functions/selectHost.js")

const client = new net.Socket();

selectHost()

.then((arr) => {
  let port = arr[0];
  let host = arr[1];
  client.connect(port, host, () => {
    console.log("Connected to server ", host , ":", port);
    menuGestion(true);
  });
})

// requests process

client.on("data", (data) => {
  console.log("\n\nReceived:\n " + data.toString());

  menuGestion();
});

// Handle the close event
client.on("close", () => {
  console.log("Connection closed");
});


function menuGestion(first = false) {

  menu(first)

  .then((request) => {
    if(request == "exit") {
      client.destroy();
      return;
    }

    client.write(request);
  })

  .catch((error) => {
    console.log("\n", error.message, "\n");
    menuGestion(first);
  })
}


