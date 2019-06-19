import { performAlgorithm } from "./algorithms/algorithms.js";

onmessage = function(e) {
  const [algorithm, thread, iterations] = e.data.split(":");
  const a = parseInt(algorithm);

  for (let i = 0; i < iterations; i++) {
    performAlgorithm(a);
  }

  postMessage(thread);
};
