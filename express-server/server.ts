var appmetrics = require("appmetrics");

// Dependencies
import express from "express";
import http from "http";
import bodyParser from "body-parser";

var monitoring = appmetrics.monitor();

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

// monitoring.on('initialized', function (env: any) {
//   env = monitoring.getEnvironment();
//   for (var entry in env) {
//       console.log(entry + ':' + env[entry]);
//   };
// });

// UTILIZZO DELLA RETE !!!
monitoring.on("http", function (http: any) {
  console.log(
    "Ricevuta chiamata http: [" +
      http.statusCode +
      "] [" +
      http.method +
      "] " +
      http.url
  );
});
monitoring.on("https", function (http: any) {
  console.log(
    "Ricevuta chiamata https: [" +
      http.statusCode +
      "] [" +
      http.method +
      "] " +
      http.url
  );
});
// -----------------------

// UTILIZZO DEL DISCO !!!
monitoring.on("cpu", function (cpu: any) {
  console.log("[" + new Date(cpu.time) + "] CPU: " + cpu.process);
});

monitoring.on("mongo", function (mongo: any) {
  console.log(
    "Mongo Query made: [" +
      new Date(mongo.time) +
      "], METHOD: " +
      mongo.method +
      "QUERY: " +
      mongo.query
  );
});
// -----------------------

// UTILIZZO DELLA MEMORIA (RAM)
monitoring.on("memory", function (memory: any) {
  console.log(
    "RAM in use: " +
      memory.physical_used +
      ". RAM available: " +
      memory.physical_free +
      "RAM used by server: " +
      memory.physical
  );
});

monitoring.on("memcached", function (memory: any) {
  console.log(
    "Memory cached: " +
      new Date(
        memory.data.time +
          "Method: [" +
          memory.data.method +
          "], Key: [" +
          memory.data.key +
          "]"
      )
  );
});

monitoring.on("gc", function (gc: any) {
  console.log("Garbage Collection cycle occurred: [" + new Date(gc.time) + "]");
  let type = "";
  switch (gc.type) {
    case "M":
      type = "major";
      break;
    case "S":
      type = "minor";
      break;
    case "I":
      type = "incremental";
      break;
    case "W":
      type = "weakcb";
      break;
  }
  console.log("GC Type: " + type);
  console.log("Javascript HEAP bytes: " + gc.size);
  console.log("Javascript used HEAP bytes: " + gc.used);
});
// -----------------------

// Listen on provided port
server.listen(port, () => console.log(`API running on localhost:${port}`));
