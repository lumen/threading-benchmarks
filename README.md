# Threading Benchmarks

Multithreading in WebAssembly (WASM) is currently supported via [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API), which aligns with the multithreading support currently available to the web platform in general.

These benchmarks attempt to analyze the performance of worker-based threading in WebAssembly and JavaScript, and measure performance relative to using [pthreads](https://en.wikipedia.org/wiki/POSIX_Threads) natively.

This exploration is especially relevent since there is the possibility that [WebAssembly will eventually adopt non-worker threading](https://github.com/WebAssembly/threads/issues/95#issuecomment-399775106).

## Scenarios

This repo explores multithreading performance in several scenarios:

- A) C compiled with Emscripten to WASM, run in the browser, spawning worker-based threads.

- B) Native C compiled with GCC, spawning pthreads

- C) JavaScript, run in the browser, spawning web workers.

These scenarios vary widely and are not all directly comparable. Despite differences, the following comparisons can be considered significant:

- A vs. B) Compares threading with web workers vs. pthreads

- A vs. C) Compares WASM vs JS performance for worker-based threading

Furthermore, _within each scenario_, benchmarks help illuminate the viability of specific types of thread usage.

_Note: Although WASM can be run in Node, Emscripten can only compile multithreaded code for the browser. Therefore, server-based WASM was left out of this comparison entirely._

### Scenario A: Browser-based WASM using worker-based threads

Prerequisites: EMCC, http-server

To compile:

```
emcc src/threads.c -O2 -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=2 -o ./dist/wasm-c/threads.js
```

To run in browser (note `-c-1` prevents caching):

```
http-server -c-1 ./dist/wasm-c/
```

Then browse to:

```
http://localhost:8080/
```

### Scenario B: Native C using pthreads

Prerequisites: GCC

To compile:

```
gcc src/threads.c -O2 -o ./dist/native-c/threads
```

The `threads` executable takes two ordered args:

- Fibonacci iterations
- Threads to spawn

To calculate Fib(70) in 10 spawned threads:

```
./dist/native-c/threads 70 10
```

This will output a result such as:

```
Fib(70) is 190392490709135 - calculated in 0.004000 ms
Fib(70) is 190392490709135 - calculated in 0.004000 ms
Fib(70) is 190392490709135 - calculated in 0.016000 ms
Fib(70) is 190392490709135 - calculated in 0.014000 ms
Fib(70) is 190392490709135 - calculated in 0.024000 ms
Fib(70) is 190392490709135 - calculated in 0.008000 ms
Fib(70) is 190392490709135 - calculated in 0.005000 ms
Fib(70) is 190392490709135 - calculated in 0.007000 ms
Fib(70) is 190392490709135 - calculated in 0.002000 ms
Fib(70) is 190392490709135 - calculated in 0.003000 ms
Fib(70) is 190392490709135 - calculated in 0.005000 ms
Total duration: 0.695000 ms
```

### Scenario C: Browser-based JavaScript using worker-based threads

TODO

## Results

See [some preliminary results](./results.md).
