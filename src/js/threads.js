import { performAlgorithm } from "./algorithms/algorithms.js";

export function perform(a, threads, iterationsPerThread) {
  // Spawn background workers if threads > 0
  let backgroundWork = new Promise(function(resolve) {
    let workers = [];
    let finished = 0;
    let i;

    if (threads > 0) {
      for (i = 0; i < threads; i++) {
        let worker = new Worker("./js/worker.js", { type: "module" });
        workers[i] = worker;
        worker.onmessage = function(e) {
          finished++;

          console.log(`Worker ${e.data} finished. Total: ${finished}`);

          // Note: Terminating each thread has significant performance implications
          // worker.terminate();

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
