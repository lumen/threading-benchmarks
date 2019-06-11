function duration(time_start, time_end) {
  return time_end - time_start;
}

function fibonacci(iterations) {
  const time_start = performance.now();
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

  console.log(
    `Fib(${iterations}) is ${val} - calculated in ${duration(
      time_start,
      performance.now()
    )} ms`
  );

  return val;
}

onmessage = function(e) {
  console.log("Worker: Message received from main script");
  let result = fibonacci(e.data);
  console.log("Worker: Posting message back to main script");
  postMessage(`${result}`);
};
