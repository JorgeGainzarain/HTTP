const readline = require("readline");
const getRequest = require('./Request.js');
const config = require('../config.json');

async function displayMenu(first) {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Wait till the user press enter
    if (!first) {
        await new Promise((resolve) => {
            rl.question("Press Enter to continue ", (answer) => {
                resolve();
            });
        });
    }


    // Show options
    console.log("Choose an HTTP method:");
    config.httpMethods.forEach((method, index) => {
        console.log(`${index + 1}. ${method}`);
    });
    console.log(`${config.httpMethods.length + 1}. Exit`);

    // Wait for input
    const choice = await new Promise((resolve) => {
        rl.question("Enter your choice: ", (answer) => {
            resolve(answer);
        });
    });

    const methodIndex = parseInt(choice);
    if (methodIndex >= 1 && methodIndex <= config.httpMethods.length) 
    {
        const method = config.httpMethods[methodIndex - 1];
        const path = await new Promise((resolve) => {
            rl.question("Enter the path: ", (answer) => {
                resolve(answer);
            });
        });
        rl.close();
        return getRequest(config.host, method, path);;
    } 
    else if (methodIndex === config.httpMethods.length + 1) 
    {
        rl.close();
        return "exit";
    } 
    else 
    {
        rl.close();
        throw new Error("Invalid choice. Please try again.");
    }
}

module.exports = displayMenu;