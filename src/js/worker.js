import { performAlgorithm } from "../algorithms/algorithms.js";

onmessage = function(e) {
  const { algorithm, thread, iterations } = e.data;
  const a = parseInt(algorithm);

  for (let i = 0; i < iterations; i++) {
    performAlgorithm(a, false, false);
  }

  postMessage(thread);
};
