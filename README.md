# Threading Benchmarks

Multithreading in WebAssembly (WASM) is currently supported via [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API), which aligns with the multithreading support currently available to the web platform in general.

These benchmarks attempt to analyze the performance of worker-based threading in WebAssembly and JavaScript, and measure performance relative to using [pthreads](https://en.wikipedia.org/wiki/POSIX_Threads) natively.

This exploration is especially relevent since there is the possibility that [WebAssembly will eventually adopt non-worker threading](https://github.com/WebAssembly/threads/issues/95#issuecomment-399775106).

## Scenarios

This repo explores multithreading performance in several scenarios:

- A) JavaScript, run in the browser, spawning and tearing down web workers.

- B) JavaScript, run in the browser, reusing existing web workers.

- C) C compiled with Emscripten to WASM, run in the browser, reusing persistent workers from a pool specified at compile time.

- D) Native C compiled with GCC, spawning pthreads

Scenarios A - C can be explored directly in your browser at:

https://wasm-threading-benchmarks.netlify.com/

Alternatively, you can clone this project and follow the instructions below to run it locally.

Scenario D can only be explored locally.

## Interesting comparisons

These scenarios vary widely and are not all directly comparable. Despite differences, the following comparisons can be considered significant:

- A vs. B) Illustrates the cost of spawning and tearing down web workers.

- B vs. C) Compares WASM vs JS performance for worker-based threading (both use persistent web workers).

- C vs. D) Compares threading with web workers vs. pthreads, as well as native C vs. emscripten-compiled WASM

Furthermore, _within each scenario_, more settings help illuminate the viability of specific types of thread usage. These settings include:

- Algorithm (e.g. fibonacci, integer multiplication, quicksort) performed as work

- Number of background threads to use

- Where the work is performed (on the main thread / background threads)

- A work multiplier to see the effects of workload

Not all options are available for all scenarios.

_Note: Although WASM can be run in Node, Emscripten can only compile multithreaded code for the browser. Therefore, server-based WASM was left out of this comparison entirely._

## Running locally

### Building and serving the site

Clone this project and then install its JS dependencies:

```
yarn install
```

To run the WASM benchmarks, you'll need to install Emscripten. See https://emscripten.org/

To build the project:

```
yarn run build
```

To serve the site:

```
yarn run serve
```

You can then view the site locally at: http://localhost:8080/

### Scenario D: Native C using pthreads

Prerequisites: GCC

To compile:

```
yarn run build:nc
```

To execute:

```
yarn run exec:nc
```

The executable takes two ordered args:

- Number of background threads (default: 1)
- Work multiplier (default: 1)

To use 4 threads and a work multiplier of 10:

```
yarn run exec:nc 4 10
```

This will output a result such as:

```
$ ./dist/native-c/threads 4 10
Background threads: 4
Iterations per thread: 10


Performing Fibonacci
Background: Fibonacci performed in 0.163000 ms
Main: Fibonacci performed in 0.257000 ms
Background: Fibonacci performed in 0.466000 ms
Background: Fibonacci performed in 0.496000 ms
Background: Fibonacci performed in 0.519000 ms
Fibonacci finished in 0.837000 ms


Performing Multiply(Int)
Background: Multiply(Int) performed in 0.023000 ms
Main: Multiply(Int) performed in 0.011000 ms
Background: Multiply(Int) performed in 0.016000 ms
Background: Multiply(Int) performed in 0.016000 ms
Background: Multiply(Int) performed in 0.090000 ms
Multiply(Int) finished in 0.374000 ms


Performing Quicksort(Int)
Main: Quicksort(Int) performed in 4.749000 ms
Background: Quicksort(Int) performed in 13.490000 ms
Background: Quicksort(Int) performed in 23.347000 ms
Background: Quicksort(Int) performed in 24.775000 ms
Background: Quicksort(Int) performed in 25.294000 ms
Quicksort(Int) finished in 25.392000 ms


Total duration: 26.705000 ms
```

[Further work](https://github.com/lumen/threading-benchmarks/issues/11) could be performed to save these results to a JSON format and allow them to be uploaded to the benchmarking site. This would facilitate side-by-side comparisons with the other scenarios.
