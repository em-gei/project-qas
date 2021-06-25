// MUST BE FIRST INSTRUCTION
var appmetrics = require("appmetrics");

// Dependencies
import express from "express";
import http from "http";
import bodyParser from "body-parser";
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const myLogger = require("./logger"); // LOGGER SHOULD BE ADD IF WANT TO ADD CONFIDENTIALITY THREAT


var monitoring = appmetrics.monitor();
let cpuUsage: string;
let networkCall: string;
let ram: string;
let memCached: string;
let garbageCollector: string;
let counter: number = 0;

const app = express();

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Malicius logger
// app.use(myLogger()); // // LOGGER SHOULD BE ADD IF WANT TO ADD CONFIDENTIALITY THREAT

// Cross Origin middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// API routes
const api = require("./api-routes");
app.use("/api", api);

// Set server port
const port = process.env.PORT || "3000";
app.set("port", port);

// Create HTTP server
const server = http.createServer(app);

const csvWriter = createCsvWriter({
  path: 'log-data-confidentiality-threats.csv',
  header: [
    {id: 'time', title: 'Time'},
    {id: 'cpu', title: 'Cpu Usage %'},
    {id: 'network', title: 'Network Call'},
    {id: 'ram', title: 'RAM Usage % by server'},
    {id: 'gc', title: 'Garbage Collector (Javascript used HEAP bytes)'}
  ]
});
let data: { time: Date, cpu: string, network: string, ram: string, memCached: string, gc: string }[] = new Array();

// NETWORK USAGE
monitoring.on("http", function (http: any) {
  networkCall = "[IN] - " + +http.statusCode + ' [' + http.method + '] ' + http.url;
  let obj = {
    time: new Date(),
    cpu: cpuUsage,
    network: networkCall,
    ram: ram,
    memCached: memCached,
    gc: garbageCollector
  };
  pushData(obj);
});
monitoring.on("https", function (http: any) {
  networkCall = "[IN] - " + +http.statusCode + ' [' + http.method + '] ' + http.url;
  let obj = {
    time: new Date(),
    cpu: cpuUsage,
    network: networkCall,
    ram: ram,
    memCached: memCached,
    gc: garbageCollector
  };
  pushData(obj);
});
monitoring.on("http-outbound", function (resp: any) {
  networkCall = "[OUT] - " + +resp.statusCode + ' [' + resp.method + '] ' + resp.url;
  let obj = {
    time: new Date(),
    cpu: cpuUsage,
    network: networkCall,
    ram: ram,
    memCached: memCached,
    gc: garbageCollector
  };
  pushData(obj);
});
monitoring.on("https-outbound", function (resp: any) {
  networkCall = "[OUT] - " + +resp.statusCode + ' [' + resp.method + '] ' + resp.url;
  let obj = {
    time: new Date(),
    cpu: cpuUsage,
    network: networkCall,
    ram: ram,
    memCached: memCached,
    gc: garbageCollector
  };
  pushData(obj);
});
// -----------------------

// CPU USAGE
monitoring.on("cpu", function (cpu: any) {
  cpuUsage = cpu.process;
});

// RAM USAGE
monitoring.on("memory", function (memory: any) {
  ram = memory.physical; // RAM used by server
});
// GARBAGE COLLECTOR USAGE
monitoring.on("gc", function (gc: any) {
  garbageCollector = gc.used; // Javascript used HEAP bytes
});
// -----------------------

// Listen on provided port
server.listen(port, () => console.log(`API running on localhost:${port}`));

setInterval(()=> { timedPushData() }, 5000);

function timedPushData() {
  counter++;
  let obj = {
    time: new Date(),
    cpu: cpuUsage,
    network: '',
    ram: ram,
    memCached: memCached,
    gc: garbageCollector
  };
  pushData(obj);

  if (counter == 9) {
    // LOG FILE IS WRITTEN AFTER 45 SECONDS
    writeCsvFile();
  }
}

function writeCsvFile() { 
  csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file has been written successfully'));
}

function pushData(obj: any) {
  data.push(obj);
}
