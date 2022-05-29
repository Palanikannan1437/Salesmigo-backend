const path = require("path");
const fs = require("fs");
const threads = require("worker_threads");
const customerModel = require("../models/customerModel");

//trying caching to avoid loading data from db
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

let finalResults;

// global options
const options = {
  dbFile: `${__dirname}/customers.json`, // sample face db
  dbMax: 100000, // maximum number of records to hold in memory (takes 512mb in memory)
  threadPoolSize: 12, // number of worker threads to create in thread pool
  workerSrc: "./face-matcher-worker.js", // code that executes in the worker thread
  debug: false, // verbose messages
  minThreshold: 0.5, // match returns first record that meets the similarity threshold, set to 0 to always scan all records
  descLength: 128, // descriptor length
};

// test options
const testOptions = {
  dbFact: 1, // load db n times to fake huge size
  maxJobs: 1, // exit after processing this many jobs
  fuzDescriptors: true, // randomize descriptor content before match for harder jobs
  sampleDescriptor: new Float32Array(
    Object.values({
      0: -0.1322881281375885,
      1: 0.07910476624965668,
      2: 0.11293233931064606,
      3: -0.038410864770412445,
      4: -0.03386300429701805,
      5: 0.01941090077161789,
      6: 0.02744423784315586,
      7: -0.0540907122194767,
      8: 0.15500964224338531,
      9: -0.10455518215894699,
      10: 0.1897498518228531,
      11: -0.04978882148861885,
      12: -0.2147902101278305,
      13: -0.14025568962097168,
      14: 0.0028481034096330404,
      15: 0.09782067686319351,
      16: -0.07663850486278534,
      17: -0.16478675603866577,
      18: -0.11899683624505997,
      19: -0.064798504114151,
      20: 0.006394397933036089,
      21: -0.006436078809201717,
      22: -0.010098341852426529,
      23: 0.07522917538881302,
      24: -0.2006070464849472,
      25: -0.3580733835697174,
      26: -0.07225003838539124,
      27: -0.1402166336774826,
      28: -0.08825989812612534,
      29: -0.08580835163593292,
      30: -0.07376599311828613,
      31: -0.012876871973276138,
      32: -0.2017134130001068,
      33: -0.08553005754947662,
      34: -0.0733967274427414,
      35: 0.09214035421609879,
      36: -0.014380261301994324,
      37: -0.011968082748353481,
      38: 0.09815303981304169,
      39: -0.021176112815737724,
      40: -0.16152425110340118,
      41: 0.028483955189585686,
      42: 0.041359834372997284,
      43: 0.26301220059394836,
      44: 0.18435047566890717,
      45: 0.04943129047751427,
      46: -0.035997260361909866,
      47: 0.03422920033335686,
      48: 0.07762478291988373,
      49: -0.22748206555843353,
      50: 0.059585217386484146,
      51: 0.08313380926847458,
      52: 0.06890841573476791,
      53: 0.05283796414732933,
      54: 0.13400590419769287,
      55: -0.08803532272577286,
      56: -0.0036756626795977354,
      57: 0.052052680402994156,
      58: -0.18262314796447754,
      59: 0.012525390833616257,
      60: -0.0590900182723999,
      61: -0.05758145824074745,
      62: -0.006195807829499245,
      63: -0.044340942054986954,
      64: 0.17056876420974731,
      65: 0.08462584763765335,
      66: -0.05431855469942093,
      67: -0.0721316710114479,
      68: 0.14952078461647034,
      69: -0.1555347740650177,
      70: 0.02155471220612526,
      71: 0.04501423239707947,
      72: -0.09527391195297241,
      73: -0.16365648806095123,
      74: -0.29954656958580017,
      75: 0.13381332159042358,
      76: 0.4620418846607208,
      77: 0.18578311800956726,
      78: -0.12618431448936462,
      79: 0.05393712967634201,
      80: -0.10404440015554428,
      81: -0.03660166263580322,
      82: 0.04810129851102829,
      83: -0.05604610592126846,
      84: -0.08159017562866211,
      85: 0.07154481112957001,
      86: -0.09464665502309799,
      87: 0.10678643733263016,
      88: 0.14198404550552368,
      89: 0.0346536710858345,
      90: -0.03253008797764778,
      91: 0.1842488795518875,
      92: -0.0293279979377985,
      93: -0.013379499316215515,
      94: 0.08290130645036697,
      95: -0.015808044001460075,
      96: -0.07452268153429031,
      97: 0.048514120280742645,
      98: -0.14639721810817719,
      99: 0.05315571278333664,
      100: 0.07274380326271057,
      101: -0.10741071403026581,
      102: 0.0424099825322628,
      103: 0.026829658076167107,
      104: -0.18069590628147125,
      105: 0.05353765934705734,
      106: 0.04910622909665108,
      107: -0.05289525166153908,
      108: -0.028217323124408722,
      109: 0.11246917396783829,
      110: -0.22291794419288635,
      111: -0.044907134026288986,
      112: 0.14946560561656952,
      113: -0.2853691875934601,
      114: 0.13574592769145966,
      115: 0.15457333624362946,
      116: 0.014560464769601822,
      117: 0.1477300524711609,
      118: 0.08837994188070297,
      119: 0.010443420149385929,
      120: -0.01795238070189953,
      121: -0.019177662208676338,
      122: -0.089767225086689,
      123: -0.06783907115459442,
      124: 0.12336111068725586,
      125: 0.003578372299671173,
      126: 0.14321064949035645,
      127: 0.08952612429857254,
    })
  ),
};

let t0 = process.hrtime.bigint(); // used for perf counters

const appendRecords = (labels, descriptors, data) => {
  if (!data.view) return 0;
  if (descriptors.length !== labels.length) {
    console.error("append error:", {
      descriptors: descriptors.length,
      labels: labels.length,
    });
  }
  for (let i = 0; i < descriptors.length; i++) {
    for (let j = 0; j < descriptors[i].length; j++) {
      data.view[data.labels.length * descriptors[i].length + j] =
        descriptors[i][j];
    }
    data.labels.push(labels[i]);
  }
  for (const worker of data.workers) {
    if (worker) worker.postMessage({ records: data.labels.length });
  }
  return data.labels.length;
};

const getLabel = (index) => data.labels[index];

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

async function workersClose(res, data) {
  const current = data.workers.filter((worker) => !!worker).length;
  console.info("closing workers:", {
    poolSize: data.workers.length,
    activeWorkers: current,
  });
  for (const worker of data.workers) {
    if (worker) worker.postMessage({ shutdown: true }); // tell worker to exit
  }
  await delay(250); // wait a little for threads to exit on their own
  const remaining = data.workers.filter((worker) => !!worker).length;
  if (remaining > 0) {
    console.info("terminating remaining workers:", {
      remaining: current,
      pool: data.workers.length,
    });
    for (const worker of data.workers) {
      if (worker) worker.terminate(); // if worker did not exit cleany terminate it
    }
  }
  res.status(200).json({
    _label: data.labels[finalResults.index],
    _distance: finalResults.distance,
  });
}

const workerMessage = (index, msg, res, data) => {
  if (msg.request) {
    if (options.debug)
      console.log("message: ", {
        worker: index,
        request: msg.request,
        time: msg.time,
        label: getLabel(msg.index),
        similarity: msg.similarity,
      });
    else {
      finalResults = msg;
      console.log("messsage: ", msg);
    }
    if (msg.request >= testOptions.maxJobs) {
      const t1 = process.hrtime.bigint();
      const elapsed = Math.round(Number(t1 - t0) / 1000 / 1000);
      console.log({
        matchJobsFinished: testOptions.maxJobs,
        totalTimeMs: elapsed,
        averageTimeMs: Math.round((100 * elapsed) / testOptions.maxJobs) / 100,
      });
      workersClose(res, data);
    }
  } else {
    const t1 = process.hrtime.bigint();
    const elapsed = Math.round(Number(t1 - t0) / 1000 / 1000);
    console.log({
      matchJobsFinished: testOptions.maxJobs,
      totalTimeMs: elapsed,
      averageTimeMs: Math.round((100 * elapsed) / testOptions.maxJobs) / 100,
    });
    console.log("message: ", {
      worker: index,
      msg,
      label: data.labels[msg.index],
    });
    workersClose();
    return {
      _label: data.labels[msg.index],
      _distance: msg.distance,
    };
  }
};

async function workerClose(id, code, data) {
  const previous = data.workers.filter((worker) => !!worker).length;
  delete data.workers[id];
  const current = data.workers.filter((worker) => !!worker).length;
  if (options.debug)
    console.log("worker exit:", { id, code, previous, current });
}

async function workersStart(numWorkers, res, data) {
  const previous = data.workers.filter((worker) => !!worker).length;
  console.info("starting worker thread pool:", {
    totalWorkers: numWorkers,
    alreadyActive: previous,
  });
  for (let i = 0; i < numWorkers; i++) {
    if (!data.workers[i]) {
      const worker = new threads.Worker(
        path.join(__dirname, options.workerSrc)
      );
      worker.on("message", (msg) => workerMessage(i, msg, res, data));
      worker.on("error", (err) => console.error("worker error:", { err }));
      worker.on("exit", (code) => workerClose(i, code, data));
      worker.postMessage(data.buffer); // send buffer to worker
      data.workers[i] = worker;
    }
    data.workers[i]?.postMessage({
      records: data.labels.length,
      threshold: options.minThreshold,
      debug: options.debug,
    });
  }
  await delay(100);
}

const match = async (descriptor, data) => {
  const buffer = new ArrayBuffer(options.descLength * 4);
  const view = new Float32Array(buffer);
  view.set(descriptor);
  const available = data.workers.filter((worker) => !!worker).length;
  if (available > 0) {
    data.workers[data.requestID % available].postMessage(
      { descriptor: buffer, request: data.requestID },
      [buffer]
    );
  } else console.error("no available workers");
};

async function loadDB(count, data) {
  const previous = data.labels.length;
  if (!fs.existsSync(options.dbFile)) {
    console.error("db file does not exist:", options.dbFile);
    return;
  }
  t0 = process.hrtime.bigint();
  for (let i = 0; i < count; i++) {
    const db = JSON.parse(fs.readFileSync(options.dbFile).toString());

    const names = db.map((record) => record.customer_img_label);
    const descriptors = db.map(
      (record) =>
        new Float32Array(Object.values(record.customer_img_descriptions[0]))
    );
    appendRecords(names, descriptors, data);
  }
  console.log("db loaded:", {
    existingRecords: previous,
    newRecords: data.labels.length,
  });
}

async function loadDBFromMongo(count, res, data) {
  const previous = data.labels.length;

  t0 = process.hrtime.bigint();
  for (let i = 0; i < count; i++) {
    let db = await customerModel.find(
      {},
      { customer_img_label: 1, customer_img_descriptions: 1 }
    );

    //caching data from db!
    // const faceDescriptorsFromDB = myCache.get("faces");
    // if (faceDescriptorsFromDB == undefined) {
    //   console.log("cache miss");
    //   db = await customerModel.find(
    //     {},
    //     { customer_img_label: 1, customer_img_descriptions: 1 }
    //   );
    //   myCache.set("faces", db, 100000);
    // } else {
    //   console.log("cache hit");
    //   db = faceDescriptorsFromDB;
    // }

    let db_expanded = [];
    let names = [];

    for (i = 0; i < db.length; i++) {
      for (j = 0; j < db[i].customer_img_descriptions.length; j++) {
        db_expanded.push(
          new Float32Array(Object.values(db[i].customer_img_descriptions[j]))
        );
        names.push(db[i].customer_img_label);
      }
    }
    appendRecords(names, db_expanded, data);
  }
  console.log("db loaded:", {
    existingRecords: previous,
    newRecords: data.labels.length,
  });
}

async function createBuffer(data) {
  data.buffer = new SharedArrayBuffer(4 * options.dbMax * options.descLength);
  data.view = new Float32Array(data.buffer);
  data.labels.length = 0;
  console.log("created shared buffer:", {
    maxDescriptors: (data.view?.length || 0) / options.descLength,
    totalBytes: data.buffer.byteLength,
    totalElements: data.view?.length,
  });
}

module.exports = async (detectionDescriptor, res) => {
  const data = {
    labels: [],
    buffer: null,
    view: null,
    workers: [],
    requestID: 0,
  };
  await createBuffer(data);

  // await loadDB(testOptions.dbFact, data);
  await loadDBFromMongo(testOptions.dbFact, res, data);

  await workersStart(options.threadPoolSize, res, data);
  for (let i = 0; i < testOptions.maxJobs; i++) {
    data.requestID++; // increase request id
    console.log(data.requestID);
    match(detectionDescriptor, data);
    if (options.debug) console.info("submited job", data.requestID);
  }

  console.log("submitted:", {
    matchJobs: testOptions.maxJobs,
    poolSize: data.workers.length,
    activeWorkers: data.workers.filter((worker) => !!worker).length,
  });
  console.log(finalResults);
};
