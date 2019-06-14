import { algorithmName, performAlgorithm } from "./algorithms/algorithms.js";

function duration(time_start, time_end) {
  return time_end - time_start;
}

onmessage = function(e) {
  const [thread, algorithm, iterationsPerThread] = e.data.split(":");
  const a = parseInt(algorithm);
  const timeStart = performance.now();

  for (let i = 0; i < iterationsPerThread; i++) {
    performAlgorithm(a);
  }

  console.log(
    `Worker[${thread}]: ${algorithmName(
      a
    )} performed ${iterationsPerThread} times in ${duration(
      timeStart,
      performance.now()
    )} ms\n`
  );

  postMessage(thread);
};
