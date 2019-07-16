#include "../algorithms/algorithms.h"
#include <inttypes.h>
#include <pthread.h>
#include <stdio.h>
#include <time.h>

// Duration in ms
double duration(clock_t time_start, clock_t time_end) {
  return ((double)(time_end - time_start)) / CLOCKS_PER_SEC * 1000;
}

double time_algorithm(int a, int iterations, bool is_main_thread,
                      bool is_post_message) {
  clock_t time_start = clock();

  for (int i = 0; i < iterations; i++) {
    perform_algorithm(a, is_main_thread, is_post_message);
  }

  return duration(time_start, clock());
}

// Start function for the background thread
void *bg_func(void *arg) {
  int *a = (void *)arg;

  printf("Background: %s performed in %f ms\n", algorithm_name(a[0]),
         time_algorithm(a[0], a[1], false, false));

  return arg;
}

void perform(int a, int threads, int iterations_per_thread) {
  clock_t time_start = clock();

  printf("\nPerforming %s\n", algorithm_name(a));

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
  printf("Main: %s performed in %f ms\n", algorithm_name(a),
         time_algorithm(a, iterations_per_thread, true, false));

  // Wait for background threads to finish
  for (int i = 0; i < threads; i++) {
    if (pthread_join(bg_thread[i], NULL)) {
      perror("Thread join failed");
    }
  }

  printf("%s finished in %f ms\n\n", algorithm_name(a),
         duration(time_start, clock()));
}

// Foreground thread and main entry point
int main(int argc, char *argv[]) {
  int threads = argc > 1 ? strtoimax(argv[1], NULL, 10) : 1;
  int iterations_per_thread = argc > 2 ? strtoimax(argv[2], NULL, 10) : 1;
  clock_t time_start = clock();

  printf("Background threads: %d\n", threads);
  printf("Iterations per thread: %d\n\n", iterations_per_thread);

  perform(FIBONACCI, threads, iterations_per_thread);
  perform(MULTIPLY_INT, threads, iterations_per_thread);
  perform(QUICKSORT_INT, threads, iterations_per_thread);

  printf("\nTotal duration: %f ms\n", duration(time_start, clock()));

  return 0;
}
