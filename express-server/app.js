// Dependencies
const express = require("express");
const http = require("http");
const bodyParser = require('bodyParser');

const app = express();
// API routes
const api = require("./api-routes");

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cross Origin middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api", api);

// Set server port
const port = process.env.PORT || "3000";
app.set("port", port);

// Create HTTP server
const server = http.createServer(app);

// Listen on provided port
server.listen(port, () => console.log(`API running on localhost:${port}`));
