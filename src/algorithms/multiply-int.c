int multiply_int(int a, int b, int n) {
  int c = 1;
  for (int i = 0; i < n; i++) {
    c = c * a * b;
  }
  return c;
}