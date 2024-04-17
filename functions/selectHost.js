const readline = require("readline");
const fs = require("fs");
const path = require("path");
const config = require("../config.json");

async function selectHost() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    if (typeof config.hosts !== 'object' || config.hosts === null) {
        console.error("Error: config.hosts is not a valid object.");
        rl.close();
        return;
    }

    console.log("Available hosts:");
    let index = 1;

    let auxHosts = [];

    for (const key in config.hosts) {
        auxHosts[index] = config.hosts[key];
        console.log(`${index}. ${key}: (${config.hosts[key]})`);
        index++;
    }
    
    console.log(`${index}. Add a new host`);
    console.log(`${index + 1}. Remove a host`);

    let host = "";

    const selectedOption = await new Promise((resolve) => {
        rl.question("Select an option: ", (answer) => {
            if (answer == index) {
                rl.question("Enter the name of the new host: ", (name) => {
                    rl.question("Enter the URL of the new host: ", (url) => {
                        config.hosts[name] = url;
                        saveConfigToFile();
                        console.log(`Added new host: ${name}`);
                        auxHosts[index] = url;
                        resolve(url);
                    });
                });
            } else if (answer == index + 1) {
                rl.question("Enter the index of the host to remove: ", (removeIndex) => {
                    const removedHost = auxHosts[removeIndex];
                    delete config.hosts[Object.keys(config.hosts)[removeIndex - 1]];
                    saveConfigToFile();
                    console.log(`Removed host: ${removedHost}`);
                    rl.close();
                    selectHost(); // Recursive call to restart function
                });
            } else if (answer > 0 && answer < index) {
                host = auxHosts[answer];
                resolve(host);
            }
            else {
                console.log("\nPlease select a valid index\n")
                rl.close()
                selectHost();
            }
        });
    });

    config.host = selectedOption;
    await saveConfigToFile();

    // Before returning we select the port 

    const port = await new Promise((resolve) => {
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
    });
    
    rl.close();

    console.log("\nSelected:\nPort: ", port, "\nHost: ", selectedOption, "\n")

    return [port,selectedOption];
}

function saveConfigToFile() {
    const configPath = path.join(__dirname, "../config.json");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("Config saved to file.");
}

module.exports = selectHost;