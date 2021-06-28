// MUST BE FIRST INSTRUCTION
var appmetrics = require("appmetrics");

// Dependencies
import express from "express";
import http from "http";
import bodyParser from "body-parser";
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const myLogger = require("./logger"); // LOGGER SHOULD BE ADD IF WANT TO ADD CONFIDENTIALITY THREAT


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

// Local Variables
let callList: number[] = [];
let oldCpuUsage: number | null = null;
let oldRamUsage: number | null = null;
let oldMemCachedUsage: number | null = null;
let oldGcUsage: number | null = null;
let inCallTime: number;

const csvWriter = createCsvWriter({
  path: 'log-data-integrity-threats.csv',
  header: [
    {id: 'time', title: 'Time'},
    {id: 'cpu', title: 'Cpu Usage %'},
    {id: 'network', title: 'Network Call'},
    {id: 'ram', title: 'RAM Usage % by server'},
    {id: 'gc', title: 'Garbage Collector (Javascript used HEAP bytes)'},
    {id: 'classType', title: 'Class'}
  ]
});
let data: { time: Date, cpu: string, network: string, ram: string, memCached: string, gc: string }[] = new Array();

// NETWORK USAGE
monitoring.on("http", function (http: any) {
  networkCall = "[IN] - " + +http.statusCode + ' [' + http.method + '] ' + http.url;
  inCallTime = http.time;
  let obj = {
    time: new Date(),
    cpu: cpuUsage,
    network: networkCall,
    ram: ram,
    memCached: memCached,
    gc: garbageCollector,
    classType: getCallType(inCallTime)
  };
  pushData(obj);
});
monitoring.on("https", function (http: any) {
  networkCall = "[IN] - " + +http.statusCode + ' [' + http.method + '] ' + http.url;
  inCallTime = http.time;
  let obj = {
    time: http.time,
    cpu: cpuUsage,
    network: networkCall,
    ram: ram,
    memCached: memCached,
    gc: garbageCollector,
    classType: getCallType(inCallTime)
  };
  pushData(obj);
});
monitoring.on("http-outbound", function (http: any) {
  networkCall = "[OUT] - " + +http.statusCode + ' [' + http.method + '] ' + http.url;

  let obj = {
    time: new Date(),
    cpu: cpuUsage,
    network: networkCall,
    ram: ram,
    memCached: memCached,
    gc: garbageCollector,
    classType: getOutCallType(http.time)
  };
  pushData(obj);
});
monitoring.on("https-outbound", function (http: any) {
  networkCall = "[OUT] - " + +http.statusCode + ' [' + http.method + '] ' + http.url;
  let obj = {
    time: new Date(),
    cpu: cpuUsage,
    network: networkCall,
    ram: ram,
    memCached: memCached,
    gc: garbageCollector,
    classType: getOutCallType(http.time)
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
    gc: garbageCollector,
    classType: getDataType()
  };
  pushData(obj);

  if (counter %2 == 0) {
    fakeRequest();
  }
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

function getCallType(time: number): string {
  let type = "normal";
  callList.push(time);
  if (callList.length == 10) {
    let diff = callList[9] - callList[0];
    if (diff <= 100) {
      type = "anomaly";
    }
    callList.shift();
  }

  return type;
}

function getOutCallType(time: number): string {
  let callType = "normal";
  if (time - inCallTime < 500) {
    callType = "anomaly";
  }
  return callType;
}

function getDataType(): string {
  let classType = "normal";
  if (oldCpuUsage == null) {
    oldCpuUsage = cpuUsage;
  } else {
    classType = (cpuUsage > (oldCpuUsage + oldCpuUsage * 0.25)) ? "anomaly" : "normal";
  }
  if (oldRamUsage == null) {
    oldRamUsage = ram;
  } else {
    classType = (ram > (oldRamUsage + oldRamUsage * 0.25)) ? "anomaly" : "normal";
  }
  if (oldMemCachedUsage == null) {
    oldMemCachedUsage = memCached;
  } else {
    classType = (memCached > (oldMemCachedUsage + oldMemCachedUsage * 0.25)) ? "anomaly" : "normal";
  }
  if (oldGcUsage == null) {
    oldGcUsage = garbageCollector;
  } else {
    classType = (garbageCollector > (oldGcUsage + oldGcUsage * 0.25)) ? "anomaly" : "normal";
  }
  return classType;
}

function fakeRequest() {
  const post_options = {
    host: 'www.google.it',
    port: '',
    path: '/',
    method: 'GET'
  };
  var post_req = http.request(post_options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('Response: ' + chunk);
    });
  });

  // post the data

  post_req.end();
}