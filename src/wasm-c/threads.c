#include "../algorithms/algorithms.h"
#include <inttypes.h>
#include <pthread.h>
#include <stdio.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

void perform_algorithm_iterations(int a, int iterations, bool is_main_thread,
                                  bool is_post_message) {
  for (int i = 0; i < iterations; i++) {
    perform_algorithm(a, is_main_thread, is_post_message);
  }
}

// Start function for the background thread
void *bg_func(void *arg) {
  int *a = (void *)arg;

  perform_algorithm_iterations(a[0], a[1], false, false);

  return arg;
}

void perform(int a, int threads, int iterations_per_thread) {
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
  perform_algorithm_iterations(a, iterations_per_thread, true, false);

  // Wait for background threads to finish
  for (int i = 0; i < threads; i++) {
    if (pthread_join(bg_thread[i], NULL) != 0) {
      perror("Thread join failed");
    }
  }
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
