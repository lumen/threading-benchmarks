import {
  algorithmName,
  performAlgorithm,
  FIBONACCI,
  MULTIPLY_INT,
  QUICKSORT_INT
} from "./algorithms/algorithms.js";

function duration(time_start, time_end) {
  return time_end - time_start;
}

function performMain(a, iterations) {
  const timeStart = performance.now();

  for (let i = 0; i < iterations; i++) {
    performAlgorithm(a);
  }

  console.log(
    `Main: ${algorithmName(a)} performed ${iterations} times in ${duration(
      timeStart,
      performance.now()
    )} ms\n`
  );
}

async function perform(a, threads, iterationsPerThread) {
  const timeStart = performance.now();

  let work = new Promise(function(resolve, reject) {
    let workers = [];
    let finished = 0;
    let i;

    for (i = 0; i < threads; i++) {
      let worker = new Worker("worker.js", { type: "module" });
      workers[i] = worker;
      worker.onmessage = function(e) {
        finished++;

        // console.log(`Worker ${e.data} finished. Total: ${finished}`);

        if (finished === threads) {
          resolve();
        }
      };
      worker.postMessage(`${i}:${a}:${iterationsPerThread}`);
    }
  });

  performMain(a, iterationsPerThread);

  await work;

  console.log(
    `${algorithmName(a)} finished in ${duration(
      timeStart,
      performance.now()
    )} ms\n`
  );
}

export async function main(threads, iterationsPerThread) {
  const timeStart = performance.now();

  console.log(`Background threads: ${threads}`);
  console.log(`Iterations per thread: ${iterationsPerThread}\n`);

  await perform(FIBONACCI, threads, iterationsPerThread);
  await perform(MULTIPLY_INT, threads, iterationsPerThread);
  await perform(QUICKSORT_INT, threads, iterationsPerThread);

  console.log(`Total duration: ${duration(timeStart, performance.now())} ms\n`);
}
