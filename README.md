# HTTP-1 Server

## Description
This project is a simple HTTP server designed to handle various types of requests. It is implemented in Node.js and provides basic functionalities for handling GET, POST, PUT, and DELETE requests. The server is capable of serving static files, managing endpoints, and handling image uploads.

## Features
- Handles HTTP methods: GET, POST, PUT, DELETE
- Serves static HTML files
- Manages dynamic endpoints stored in a JSON file
- Supports image uploads with conflict detection
- Validates API keys for request authorization
- Watches for changes in configuration files and reloads them automatically

## Project Structure
- `functions/`: Contains the main server logic and utility functions
  - `handleRequest.js`: Main request handling logic
  - `httpResponse.js`: Utility for generating HTTP responses
- `resources/`: Stores static files and dynamic endpoint data
  - `endpoints.json`: JSON file storing endpoint data
- `serverConfig.json`: Configuration file for server settings, including API keys
- `static.html`: Example static HTML file served by the server

## Dependencies
- Node.js
- Built-in Node.js modules: `fs`, `path`

## Configuration
- Endpoints and server settings are configured in JSON files (`endpoints.json` and `serverConfig.json`).
- API keys are managed in `serverConfig.json`.

## Installation
1. Clone the repository:
2. Navigate to the project directory:
3. Install any necessary dependencies (if applicable).

## Usage
1. Start the server by running the main script:
   `node functions/handleRequest.js`
2. Send HTTP requests to the server using a tool like Postman or curl.
3. Manage endpoints by editing `resources/endpoints.json`.
4. Monitor server logs for request handling and configuration changes.

## Contributing
This project is currently a personal project. Contributions are welcome, but please contact the author before making any changes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
