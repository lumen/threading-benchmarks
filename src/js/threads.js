let worker = new Worker("worker.js");

worker.onmessage = function(e) {
  console.log(`Message received from worker: ${e.data}`);
};

worker.postMessage(70);
