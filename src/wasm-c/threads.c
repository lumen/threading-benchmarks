#include "../algorithms/algorithms.h"
#include <inttypes.h>
#include <pthread.h>
#include <stdio.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

// Duration in ms
// double duration(double time_start, double time_end) {
//   return (time_end - time_start);
// }

// double time_algorithm(int a, int iterations) {
//   double time_start = emscripten_get_now();

//   for (int i = 0; i < iterations; i++) {
//     perform_algorithm(a);
//   }

//   return duration(time_start, emscripten_get_now());
// }

// Start function for the background thread
void *bg_func(void *arg) {
  int *a = (void *)arg;

  // #ifdef __EMSCRIPTEN__
  //   emscripten_log(EM_LOG_CONSOLE, "Background: %s performed in %f ms\n",
  //                  algorithm_name(a[0]), time_algorithm(a[0], a[1]));
  // #endif

  return arg;
}

void perform(int a, int threads, int iterations_per_thread) {
  // double time_start = emscripten_get_now();

  // #ifdef __EMSCRIPTEN__
  //   emscripten_log(EM_LOG_CONSOLE, "\nPerforming %s\n", algorithm_name(a));
  // #endif

  // Create background threads
  pthread_t bg_thread[threads];
  for (int i = 0; i < threads; i++) {
    int args[2];
    args[0] = a;
    args[1] = iterations_per_thread;
    if (pthread_create(&bg_thread[i], NULL, bg_func, &args)) {
      perror("Thread create failed");
    }
  }

  // Perform on the foreground thread
  // printf("Main: %s performed in %f ms\n", algorithm_name(a),
  //        time_algorithm(a, iterations_per_thread));

  // Wait for background threads to finish
  for (int i = 0; i < threads; i++) {
    if (pthread_join(bg_thread[i], NULL)) {
      perror("Thread join failed");
    }
  }

  // #ifdef __EMSCRIPTEN__
  //   emscripten_log(EM_LOG_CONSOLE, "%s finished in %f ms\n\n",
  //   algorithm_name(a),
  //                  duration(time_start, emscripten_get_now()));
  // #endif
}

// Foreground thread and main entry point
int main(int argc, char *argv[]) {
  int algorithm = strtoimax(argv[1], NULL, 10);
  int threads = strtoimax(argv[2], NULL, 10);
  int iterations_per_thread = strtoimax(argv[3], NULL, 10);

  // printf("Algorithm: %s\n", algorithm_name(algorithm));
  // printf("Background threads: %d\n", threads);
  // printf("Iterations per thread: %d\n\n", iterations_per_thread);

  // double time_start = emscripten_get_now();

  perform(algorithm, threads, iterations_per_thread);

  // #ifdef __EMSCRIPTEN__
  //   emscripten_log(EM_LOG_CONSOLE, "Total duration: %f ms\n",
  //                  duration(time_start, emscripten_get_now()));
  // #endif

  return 0;
}
