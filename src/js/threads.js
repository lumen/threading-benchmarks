import { performAlgorithm } from "./algorithms/algorithms.js";

export function prepareJSWorkers(threads) {
  let workers = [];
  for (let i = 0; i < threads; i++) {
    let worker = new Worker("./js/worker.js", { type: "module" });
    workers.push(worker);
  }
  return workers;
}

export async function terminateJSWorkers(workers) {
  for (let worker of workers) {
    await worker.terminate();
  }
}

export async function performAlgorithmInJS(
  a,
  threads,
  iterationsPerThread,
  options = {}
) {
  // Spawn background workers if threads > 0
  let backgroundWork = new Promise(function(resolve) {
    if (threads > 0) {
      let workersProvided = !!options.workers;
      let workers = options.workers || prepareJSWorkers(threads);
      let finished = 0;

      for (let i = 0; i < threads; i++) {
        let worker = workers[i];
        worker.onmessage = function(e) {
          finished++;
          // console.log(`Worker ${e.data} finished. Total: ${finished}`);

          // Note: Terminating each thread has significant performance implications
          if (!workersProvided) {
            worker.terminate();
          }

          if (finished === threads) {
            resolve();
          }
        };
        worker.postMessage(`${a}:${i}:${iterationsPerThread}`);
      }
    } else {
      resolve();
    }
  });

  // Perform algorithm on main thread
  for (let i = 0; i < iterationsPerThread; i++) {
    performAlgorithm(a);
  }

  return backgroundWork;
}
