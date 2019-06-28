import { performAlgorithm } from "./algorithms/algorithms.js";

export function prepareJSWorkers(threads) {
  let workers = [];
  for (let i = 0; i < threads; i++) {
    let worker = new Worker("./js/worker.js");
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
  algorithm,
  threads,
  iterations,
  options = {}
) {
  // Spawn background workers if threads > 0
  let backgroundWork = new Promise(function(resolve) {
    if (threads > 0) {
      let workersProvided = !!options.workers;
      let workers = options.workers || prepareJSWorkers(threads);
      let finished = 0;

      for (let thread = 0; thread < threads; thread++) {
        let worker = workers[thread];
        worker.onmessage = function(e) {
          let { data } = e;

          if (typeof data === "object") {
            let { algorithm } = data;
            if (algorithm !== undefined) {
              performAlgorithm(algorithm, true, true);
            } else {
              throw new Error("Unexpected message from worker");
            }
          } else {
            finished++;

            // console.log(`Worker ${e.data} finished. Total: ${finished}`);

            // Note: Terminating each thread has significant performance implications
            if (!workersProvided) {
              worker.terminate();
            }

            if (finished === threads) {
              resolve();
            }
          }
        };
        worker.postMessage({
          algorithm,
          thread,
          iterations
        });
      }
    } else {
      resolve();
    }
  });

  // Perform algorithm on main thread
  for (let i = 0; i < iterations; i++) {
    performAlgorithm(algorithm, true, false);
  }

  return backgroundWork;
}
