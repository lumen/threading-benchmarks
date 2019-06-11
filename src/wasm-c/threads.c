#include <inttypes.h>
#include <pthread.h>
#include <stdio.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

// Duration in ms
double duration(double time_start, double time_end) {
  return (time_end - time_start);
}

unsigned long fibonacci(int iterations) {
  double time_start = emscripten_get_now();
  unsigned long val = 0;
  unsigned long last = 0;

  if (iterations > 0) {
    val++;

    for (int i = 1; i < iterations; i++) {
      unsigned long seq;

      seq = val + last;
      last = val;
      val = seq;
    }
  }

#ifdef __EMSCRIPTEN__
  emscripten_log(EM_LOG_CONSOLE, "Fib(%d) is %ld - calculated in %f ms\n",
                 iterations, val, duration(time_start, emscripten_get_now()));
#endif

  return val;
}

// Start function for the background thread
void *bg_func(void *arg) {
  int *iter = (void *)arg;
  *iter = fibonacci(*iter);
  return arg;
}

// Foreground thread and main entry point
int main(int argc, char *argv[]) {
  clock_t time_start = emscripten_get_now();

  int iterations = argc > 1 ? strtoumax(argv[1], NULL, 10) : 70;
  int threads = argc > 2 ? strtoimax(argv[2], NULL, 10) : 1;

  // Create background threads
  pthread_t bg_thread[threads];
  for (int i = 0; i < threads; i++) {
    if (pthread_create(&bg_thread[i], NULL, bg_func, &iterations)) {
      perror("Thread create failed");
      return 1;
    }
  }

  // Calculate on the foreground thread
  fibonacci(iterations);

  // Wait for background threads to finish
  for (int i = 0; i < threads; i++) {
    if (pthread_join(bg_thread[i], NULL)) {
      perror("Thread join failed");
      return 2;
    }
  }

#ifdef __EMSCRIPTEN__
  emscripten_log(EM_LOG_CONSOLE, "Total duration: %f ms\n",
                 duration(time_start, emscripten_get_now()));
#endif

  return 0;
}
