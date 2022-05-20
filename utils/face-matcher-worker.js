const { euclideanDistance } = require("@vladmandic/face-api");
const threads = require("worker_threads");

let debug = false;

let buffer;
let view;
let threshold = 0.4;
let records = 0;

const descLength = 128; // descriptor length in bytes

function distance(descBuffer, index) {
  const descriptor = new Float32Array(descBuffer);
  let array = [];
  for (let i = 0; i < descriptor.length; i++) {
    array.push(view[index * descLength + i]);
  }
  return euclideanDistance(descriptor, array);
}

function match(descBuffer) {
  let best = Number.MAX_SAFE_INTEGER;
  let index = -1;
  console.log("RECORDS!!", records);
  for (let i = 0; i < records; i++) {
    const res = distance(descBuffer, i);
    if (res < best) {
      best = res;
      index = i;
    }
    console.log(res, threshold, "resultttt", i);
    if (best === 0) break; // short circuit
  }
  return {
    index,
    distance: best,
    similarity: Math.max(0, 100 - best * 100) / 100.0,
  };
}

threads.parentPort?.on("message", (msg) => {
  if (typeof msg.descriptor !== "undefined") {
    // actual work order to find a match
    // console.log(msg.descriptor,msg.request)
    const t0 = performance.now();
    const result = match(msg.descriptor);
    const t1 = performance.now();
    threads.parentPort?.postMessage({
      request: msg.request,
      time: Math.trunc(t1 - t0),
      ...result,
    });
    return; // short circuit
  }
  if (msg instanceof SharedArrayBuffer) {
    // called only once to receive reference to shared array buffer
    buffer = msg;
    view = new Float32Array(buffer); // initialize f64 view into buffer
    if (debug) threads.parentPort?.postMessage(`buffer: ${buffer?.byteLength}`);
  }
  if (typeof msg.records !== "undefined") {
    // recived every time when number of records changes
    records = msg.records;
    if (debug) threads.parentPort?.postMessage(`records: ${records}`);
  }
  if (typeof msg.debug !== "undefined") {
    // set verbose logging
    debug = msg.debug;
    if (debug) threads.parentPort?.postMessage(`debug: ${debug}`);
  }
  if (typeof msg.threshold !== "undefined") {
    // set minimum similarity threshold
    threshold = msg.threshold;
    if (debug) threads.parentPort?.postMessage(`threshold: ${threshold}`);
  }
  if (typeof msg.shutdown !== "undefined") {
    // got message to close worker
    if (debug) threads.parentPort?.postMessage("shutting down");
    process.exit(0);
  }
});

if (debug) threads.parentPort?.postMessage("started");
