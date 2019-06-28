#include "algorithms.h"
#include "fibonacci.h"
#include "multiply-int.h"
#include "quicksort-int.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

const int FIBONACCI = 0;
const int MULTIPLY_INT = 1;
const int QUICKSORT_INT = 2;
const int FIBONACCI_ON_MAIN = 3;
const int FIBONACCI_ON_MAIN_1K = 4;

// char *algorithm_name(int a) {
//   switch (a) {
//   case FIBONACCI:
//     return "Fibonacci";
//   case MULTIPLY_INT:
//     return "Multiply(Int)";
//   case QUICKSORT_INT:
//     return "Quicksort(Int)";
//   case FIBONACCI_ON_MAIN:
//     return "Fibonacci (1K times on main x 1 call)";
//   case FIBONACCI_ON_MAIN_1K:
//     return "Fibonacci (1 time on main x 1K calls)";
//   default:
//     return "UNKNOWN ALGORITHM";
//   }
// }

// TODO - configure listener for worker
#ifdef __EMSCRIPTEN__
EM_JS(void, process_algorithm_on_main, (int a),
      { postMessage({algorithm : a}); });
#endif

void perform_fibonacci() {
  int n = 1000;
  for (int i = 0; i < n; i++) {
    fibonacci(50);
  }
}

void perform_multiply_int() { multiply_int(1, 1, 1000); }

void perform_quicksort_int() {
  int qs_int_array[1000];
  randomize_int_array(qs_int_array);
  quicksort_int(qs_int_array, 0, 999);
}

void perform_fibonacci_on_main(bool is_main_thread, bool is_post_message) {
  if (is_main_thread) {
    if (is_post_message) {
      perform_fibonacci();
    }
  } else {
#ifdef __EMSCRIPTEN__
    process_algorithm_on_main(FIBONACCI_ON_MAIN);
#endif
  }
}

void perform_fibonacci_on_main_1K(bool is_main_thread, bool is_post_message) {
  if (is_main_thread) {
    if (is_post_message) {
      fibonacci(50);
    }
  } else {
#ifdef __EMSCRIPTEN__
    int n = 1000;
    for (int i = 0; i < n; i++) {
      process_algorithm_on_main(FIBONACCI_ON_MAIN_1K);
    }
#endif
  }
}

void perform_algorithm(int a, bool is_main_thread, bool is_post_message) {
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
  case FIBONACCI_ON_MAIN:
    perform_fibonacci_on_main(is_main_thread, is_post_message);
    break;
  case FIBONACCI_ON_MAIN_1K:
    perform_fibonacci_on_main_1K(is_main_thread, is_post_message);
    break;
  }
}
