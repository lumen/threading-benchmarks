export function multiplyInt(a, b, n) {
  let c = 1;
  for (let i = 0; i < n; i++) {
    c = c * a * b;
  }
  return c;
}
