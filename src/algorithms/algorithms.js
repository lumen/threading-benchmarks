import { fibonacci } from "./fibonacci.js";
import { multiplyInt } from "./multiply-int.js";
import { quicksortInt, randomizeIntArray } from "./quicksort-int.js";

export const ALGORITHM_FIRST = 0;
export const FIBONACCI = 0;
export const MULTIPLY_INT = 1;
export const QUICKSORT_INT = 2;
export const FIBONACCI_ON_MAIN = 3;
export const FIBONACCI_ON_MAIN_1K = 4;
export const ALGORITHM_LAST = 4;

export function algorithmName(a) {
  switch (a) {
    case FIBONACCI:
      return "Fibonacci (1k iterations)";
    case MULTIPLY_INT:
      return "Multiply (1k iterations)";
    case QUICKSORT_INT:
      return "Quicksort (1 iteration)";
    case FIBONACCI_ON_MAIN:
      return "Fibonacci (1 cross-thread invocation -> 1k iterations)";
    case FIBONACCI_ON_MAIN_1K:
      return "Fibonacci (1k cross-thread invocations -> 1 iteration)";
    default:
      throw new Error("Unknown Algorithm");
  }
}

export function algorithmDescription(a) {
  switch (a) {
    case FIBONACCI:
      return "1,000 iterations of fibonacci(50), performed on the main thread AND each background thread";
    case MULTIPLY_INT:
      return "1,000 integer multiplications, performed on the main thread AND each background thread";
    case QUICKSORT_INT:
      return "Quicksort array with 1,000 members, performed on the main thread AND each background thread";
    case FIBONACCI_ON_MAIN:
      return "1,000 iterations of fibonacci(50), performed ONLY on the main thread, initiated with a single call from each background thread";
    case FIBONACCI_ON_MAIN_1K:
      return "1 iteration of fibonacci(50), performed ONLY on the main thread, initiated 1,000 times from each background thread";
    default:
      throw new Error("Unknown Algorithm");
  }
}

function performFibonacci() {
  const n = 1000;
  for (let i = 0; i < n; i++) {
    fibonacci(50);
  }
}

function performMultiplyInt() {
  multiplyInt(1, 1, 1000);
}

function performQuicksortInt() {
  let qs_int_array = new Array(1000);
  randomizeIntArray(qs_int_array);
  quicksortInt(qs_int_array, 0, 999);
}

function performFibonacciOnMain(isMainThread, isPostMessage) {
  if (isMainThread) {
    if (isPostMessage) {
      performFibonacci();
    }
  } else {
    postMessage({ algorithm: FIBONACCI_ON_MAIN });
  }
}

function performFibonacciOnMain1K(isMainThread, isPostMessage) {
  if (isMainThread) {
    if (isPostMessage) {
      fibonacci(50);
    }
  } else {
    const n = 1000;
    for (let i = 0; i < n; i++) {
      postMessage({ algorithm: FIBONACCI_ON_MAIN_1K });
    }
  }
}

export function performAlgorithm(a, isMainThread, isPostMessage) {
  switch (a) {
    case FIBONACCI:
      performFibonacci();
      break;
    case MULTIPLY_INT:
      performMultiplyInt();
      break;
    case QUICKSORT_INT:
      performQuicksortInt();
      break;
    case FIBONACCI_ON_MAIN:
      performFibonacciOnMain(isMainThread, isPostMessage);
      break;
    case FIBONACCI_ON_MAIN_1K:
      performFibonacciOnMain1K(isMainThread, isPostMessage);
      break;
  }
}
