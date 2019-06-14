export function fibonacci(iterations) {
  let val = 0;
  let last = 0;

  if (iterations > 0) {
    val++;

    for (let i = 1; i < iterations; i++) {
      let seq;

      seq = val + last;
      last = val;
      val = seq;
    }
  }

  return val;
}
