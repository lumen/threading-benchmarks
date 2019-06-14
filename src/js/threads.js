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

function perform(a, threads, iterationsPerThread) {
  let workers = [];
  let finished = 0;
  let i;

  for (i = 0; i < threads; i++) {
    let worker = new Worker("worker.js", { type: "module" });
    workers[i] = worker;
    worker.onmessage = function(e) {
      finished++;
      // console.log(`Worker ${e.data} finished. Total: ${finished}`);
    };
    worker.postMessage(`${i}:${a}:${iterationsPerThread}`);
  }

  performMain(a, iterationsPerThread);
}

export function main(threads, iterationsPerThread) {
  const timeStart = performance.now();

  console.log(`Background threads: ${threads}`);
  console.log(`Iterations per thread: ${iterationsPerThread}\n`);

  perform(FIBONACCI, threads, iterationsPerThread);
  perform(MULTIPLY_INT, threads, iterationsPerThread);
  perform(QUICKSORT_INT, threads, iterationsPerThread);

  console.log(`Total duration: ${duration(timeStart, performance.now())} ms\n`);
}
