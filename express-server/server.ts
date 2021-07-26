// MUST BE FIRST INSTRUCTION
var appmetrics = require("appmetrics");

// Dependencies
import express from "express";
import http from "http";
import bodyParser from "body-parser";
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const antivirus = require('./antivirus');

var monitoring = appmetrics.monitor();
let cpuUsage: number;
let networkCall: string;
let ram: number;
let memCached: number;
let garbageCollector: number;
let counter: number = 0;

const app = express();

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

// API routes
const api = require("./api-routes");
app.use("/api", api);

// Set server port
const port = process.env.PORT || "3000";
app.set("port", port);

// Create HTTP server
const server = http.createServer(app);

const csvWriter = createCsvWriter({
  path: 'log-dos-threats.csv',
  header: [
    {id: 'time', title: 'Time'},
    {id: 'cpu', title: 'Cpu_Usage_Percentage'},
    {id: 'network', title: 'Network_Call'},
    {id: 'ram', title: 'RAM_Usage_Percentage'},
    {id: 'gc', title: 'Garbage_Collector'},
    {id: 'classType', title: 'Class'}
  ]
});
let data: { time: Date, cpu: string, network: string, ram: string, memCached: string, gc: string }[] = new Array();

// NETWORK USAGE
monitoring.on("http", function (http: any) {
  networkCall = "[IN] - " + +http.statusCode + ' [' + http.method + '] ' + http.url;
  let obj = {
    time: http.time,
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
    time: http.time,
    cpu: cpuUsage,
    network: networkCall,
    ram: ram,
    memCached: memCached,
    gc: garbageCollector
  };
  pushData(obj);
});

monitoring.on("http-outbound", function (http: any) {
  networkCall = "[OUT] - " + +http.statusCode + ' [' + http.method + '] ' + http.url;
  let obj = {
    time: http.time,
    cpu: cpuUsage,
    network: networkCall,
    ram: ram,
    memCached: memCached,
    gc: garbageCollector
  };
  pushData(obj);
});
monitoring.on("https-outbound", function (http: any) {
  networkCall = "[OUT] - " + +http.statusCode + ' [' + http.method + '] ' + http.url;
  let obj = {
    time: http.time,
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

setInterval(()=> { timedPushData() }, 1000);

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

  if (counter % 3 == 0) {
    fakeRequest();
  }
  if (counter == 600) {
    // LOG FILE IS WRITTEN AFTER 10 MINUTES
    writeCsvFile();
  }
}

function writeCsvFile() { 
  csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file has been written successfully'));
}

function pushData(obj: any) {
  // Add type label depending on antivirus response
  antivirus.isAnomaly().then((outcome: boolean) => {
    obj['classType'] = outcome ? 'anomaly' : 'normal'
    data.push(obj);
  }); 
}

// Fake request to simulate server behaviour
function fakeRequest() {
  const post_options = {
    host: 'www.google.it',
    port: '',
    path: '/',
    method: 'GET'
  };

  var post_req = http.request(post_options, function (res) {
    res.setEncoding('utf8');
  });

  // post the data
  post_req.end();
}