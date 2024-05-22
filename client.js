const net = require("net");
const menu = require("./functions/Menu.js");
const selectHost = require("./functions/selectHost.js");
const config = require("./config.json");
const fs = require('fs');

const client = new net.Socket();

selectHost()

.then((arr) => {
  let port = arr[0];
  let host = arr[1];
  client.connect(port, host, () => {
    console.log("Connected to server", host + ":" + port);
    menuGestion(true);
  });
})

// requests process

client.on("data", (data) => {
  const dataStr = data.toString();

  if(dataStr.startsWith("Cookie")) {
    config.Cookie = dataStr.split(":")[1];
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
  }
  else {
    console.log("\n\nReceived:\n " + dataStr);
    menuGestion();
  }
});

client.on("error", (err) => {
  console.log(err.name);
  client.destroy();
})

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


