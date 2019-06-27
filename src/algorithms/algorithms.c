#include "fibonacci.h"
#include "multiply-int.h"
#include "quicksort-int.h"

enum algorithm { FIBONACCI, MULTIPLY_INT, QUICKSORT_INT };

char *algorithm_name(int a) {
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

void perform_fibonacci() {
  int n = 10000;
  for (int i = 0; i < n; i++) {
    fibonacci(50);
  }
}

void perform_multiply_int() { multiply_int(1, 1, 10000); }

void perform_quicksort_int() {
  int qs_int_array[1000];
  randomize_int_array(qs_int_array);
  quicksort_int(qs_int_array, 0, 999);
}

void perform_algorithm(int a) {
  switch (a) {
  case FIBONACCI:
    perform_fibonacci();
    break;
  case MULTIPLY_INT:
    perform_multiply_int();
    break;
  case QUICKSORT_INT:
    perform_quicksort_int();
    break;
  }
}
