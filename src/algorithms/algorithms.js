import { fibonacci } from "./fibonacci.js";
import { multiplyInt } from "./multiply-int.js";
import { quicksortInt, randomizeIntArray } from "./quicksort-int.js";

export const FIBONACCI = 0;
export const MULTIPLY_INT = 1;
export const QUICKSORT_INT = 2;

export function algorithmName(a) {
  switch (a) {
    case FIBONACCI:
      return "Fibonacci";
    case MULTIPLY_INT:
      return "Multiply(Int)";
    case QUICKSORT_INT:
      return "Quicksort(Int)";
    default:
      return "UNKNOWN ALGORITHM";
  }
}

function performFibonacci() {
  const n = 0x10000;
  for (let i = 0; i < n; i++) {
    fibonacci(50);
  }
}

function performMultiplyInt() {
  multiplyInt(1.0, 1.0, 0x100000);
}

function performQuicksortInt() {
  let qs_int_array = new Array(1000);
  randomizeIntArray(qs_int_array);
  quicksortInt(qs_int_array, 0, 999);
}

export function performAlgorithm(a) {
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
  }
}
