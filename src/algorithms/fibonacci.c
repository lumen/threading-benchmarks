unsigned long fibonacci(int iterations) {
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

  return val;
}
