const { euclideanDistance } = require("@vladmandic/face-api");
const fs = require("fs");
const path = require("path");
const threads = require("worker_threads");

// global optinos
const options = {
  dbFile: "customers.json", // sample face db
  dbMax: 10000, // maximum number of records to hold in memory
  threadPoolSize: 12, // number of worker threads to create in thread pool
  workerSrc: "./face-matcher-worker.js", // code that executes in the worker thread
  debug: false, // verbose messages
  minThreshold: 0.5, // match returns first record that meets the similarity threshold, set to 0 to always scan all records
  descLength: 128, // descriptor length
};

// test options
const testOptions = {
  dbFact: 3, // load db n times to fake huge size
  maxJobs: 2000, // exit after processing this many jobs
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
  sampleDescriptor1: new Float32Array(
    Object.values({
      0: -0.15803851187229156,
      1: 0.036868564784526825,
      2: 0.0953107476234436,
      3: -0.05338066443800926,
      4: -0.03425274044275284,
      5: 0.012906731106340885,
      6: 0.007269073277711868,
      7: -0.06160057336091995,
      8: 0.18385177850723267,
      9: -0.12118233740329742,
      10: 0.16781270503997803,
      11: -0.05122809112071991,
      12: -0.2060190588235855,
      13: -0.10737667232751846,
      14: -0.0034628906287252903,
      15: 0.08856479823589325,
      16: -0.06262224912643433,
      17: -0.15665334463119507,
      18: -0.07850180566310883,
      19: -0.0757313221693039,
      20: 0.022092878818511963,
      21: -0.0021715741604566574,
      22: -0.001872798427939415,
      23: 0.030876323580741882,
      24: -0.20806527137756348,
      25: -0.3549690246582031,
      26: -0.07835342735052109,
      27: -0.13996723294258118,
      28: -0.10410567373037338,
      29: -0.10276389122009277,
      30: -0.007622760720551014,
      31: 0.01972544938325882,
      32: -0.21083079278469086,
      33: -0.06348694860935211,
      34: -0.07943391799926758,
      35: 0.10658437758684158,
      36: 0.009532430209219456,
      37: -0.000608980655670166,
      38: 0.10778321325778961,
      39: -0.007110690698027611,
      40: -0.1498757153749466,
      41: -0.07839329540729523,
      42: 0.03877345472574234,
      43: 0.22986534237861633,
      44: 0.13034337759017944,
      45: 0.04527223855257034,
      46: 0.0059834010899066925,
      47: 0.02369374968111515,
      48: 0.04613468423485756,
      49: -0.23616130650043488,
      50: 0.042491838335990906,
      51: 0.07351839542388916,
      52: 0.08033473044633865,
      53: 0.05296816676855087,
      54: 0.10526379942893982,
      55: -0.07393438369035721,
      56: 0.011792842298746109,
      57: 0.01944548636674881,
      58: -0.15170276165008545,
      59: 0.04095561057329178,
      60: 0.0034035779535770416,
      61: -0.008159996941685677,
      62: -0.060730352997779846,
      63: -0.027209103107452393,
      64: 0.22398388385772705,
      65: 0.09709880501031876,
      66: -0.06699710339307785,
      67: -0.09083660691976547,
      68: 0.159636989235878,
      69: -0.12815017998218536,
      70: -0.025471892207860947,
      71: 0.060603637248277664,
      72: -0.11640249937772751,
      73: -0.18515652418136597,
      74: -0.26365676522254944,
      75: 0.1213485524058342,
      76: 0.47825178503990173,
      77: 0.1347222924232483,
      78: -0.11490233987569809,
      79: 0.02780931442975998,
      80: -0.10685659945011139,
      81: -0.04173863306641579,
      82: 0.03244916349649429,
      83: -0.03512924909591675,
      84: -0.06273051351308823,
      85: 0.07535277307033539,
      86: -0.04284781217575073,
      87: 0.12446141242980957,
      88: 0.18490779399871826,
      89: 0.01270689070224762,
      90: -0.06193223595619202,
      91: 0.11202742159366608,
      92: -0.039637260138988495,
      93: 0.01193265337496996,
      94: 0.02689437009394169,
      95: -0.006332062184810638,
      96: -0.028290284797549248,
      97: 0.09008117765188217,
      98: -0.11127060651779175,
      99: 0.06184837594628334,
      100: 0.11165568232536316,
      101: -0.06377746909856796,
      102: 0.034516848623752594,
      103: 0.06435620784759521,
      104: -0.15844804048538208,
      105: 0.1072857454419136,
      106: 0.02730582281947136,
      107: -0.08811518549919128,
      108: -0.009399665519595146,
      109: 0.11977959424257278,
      110: -0.2185441255569458,
      111: -0.041572585701942444,
      112: 0.1585673987865448,
      113: -0.2494044005870819,
      114: 0.15016548335552216,
      115: 0.16930823028087616,
      116: 0.002307455986738205,
      117: 0.13711433112621307,
      118: 0.055596478283405304,
      119: 0.06182330846786499,
      120: 0.032140158116817474,
      121: 0.04334588348865509,
      122: -0.12280875444412231,
      123: -0.08231228590011597,
      124: 0.09592785686254501,
      125: -0.01270452979952097,
      126: 0.09014931321144104,
      127: 0.05640082061290741,
    })
  ),
};

const data = {
  labels: [],
  buffer: null,
  view: null,
  workers: [],
  requestID: 0,
};

let t0 = process.hrtime.bigint(); // used for perf counters

const appendRecords = (labels, descriptors) => {
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

const getDescriptor = (index) => {
  if (!data.view) return [];
  const descriptor = [];
  for (let i = 0; i < 128; i++)
    descriptor.push(data.view[index * options.descLength + i]);
  return descriptor;
};

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

async function workersClose() {
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
}

const workerMessage = (index, msg) => {
  if (msg.request) {
    if (options.debug)
      console.log("message:", {
        worker: index,
        request: msg.request,
        time: msg.time,
        label: getLabel(msg.index),
        similarity: msg.similarity,
      });
    else {
      console.log("mess: ", msg);
    }
    if (msg.request >= testOptions.maxJobs) {
      const t1 = process.hrtime.bigint();
      const elapsed = Math.round(Number(t1 - t0) / 1000 / 1000);
      console.log({
        matchJobsFinished: testOptions.maxJobs,
        totalTimeMs: elapsed,
        averageTimeMs: Math.round((100 * elapsed) / testOptions.maxJobs) / 100,
      });
      workersClose();
    }
  } else {
    const t1 = process.hrtime.bigint();
    const elapsed = Math.round(Number(t1 - t0) / 1000 / 1000);
    console.log({
      matchJobsFinished: testOptions.maxJobs,
      totalTimeMs: elapsed,
      averageTimeMs: Math.round((100 * elapsed) / testOptions.maxJobs) / 100,
    });
    console.log("message:", { worker: index, msg });
  }
};

async function workerClose(id, code) {
  const previous = data.workers.filter((worker) => !!worker).length;
  delete data.workers[id];
  const current = data.workers.filter((worker) => !!worker).length;
  if (options.debug)
    console.log("worker exit:", { id, code, previous, current });
}

async function workersStart(numWorkers) {
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
      worker.on("message", (msg) => workerMessage(i, msg));
      worker.on("error", (err) => console.error("worker error:", { err }));
      worker.on("exit", (code) => workerClose(i, code));
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

const match = (descriptor) => {
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

async function loadDB(count) {
  const previous = data.labels.length;
  if (!fs.existsSync(options.dbFile)) {
    console.error("db file does not exist:", options.dbFile);
    return;
  }
  t0 = process.hrtime.bigint();
  for (let i = 0; i < count; i++) {
    const db = JSON.parse(fs.readFileSync(options.dbFile).toString());
    // console.log(
    //   new Float32Array(Object.values(db[i].customer_img_descriptions[0]))
    // );
    // console.log(db[0].embedding)

    const names = db.map((record) => record.customer_img_label);
    const descriptors = db.map(
      (record) =>
        new Float32Array(Object.values(record.customer_img_descriptions[0]))
    );
    appendRecords(names, descriptors);
  }
  console.log("db loaded:", {
    existingRecords: previous,
    newRecords: data.labels.length,
  });
}

async function createBuffer() {
  data.buffer = new SharedArrayBuffer(4 * options.dbMax * options.descLength);
  data.view = new Float32Array(data.buffer);
  data.labels.length = 0;
  console.log("created shared buffer:", {
    maxDescriptors: (data.view?.length || 0) / options.descLength,
    totalBytes: data.buffer.byteLength,
    totalElements: data.view?.length,
  });
}

async function main() {
  await createBuffer();
  await loadDB(testOptions.dbFact);
  await workersStart(options.threadPoolSize);
  for (let i = 0; i < 100; i++) {
    const idx = Math.trunc(data.labels.length * Math.random());
    const descriptor = getDescriptor(2);
    console.log(
      "distance euclidean!!",
      euclideanDistance(descriptor, testOptions.sampleDescriptor1)
    );
    match(testOptions.sampleDescriptor);
    if (options.debug) console.info("submited job", data.requestID);
  }
  console.log("submitted:", {
    matchJobs: testOptions.maxJobs,
    poolSize: data.workers.length,
    activeWorkers: data.workers.filter((worker) => !!worker).length,
  });
}

main();
