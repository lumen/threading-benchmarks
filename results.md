# Preliminary results

This is a very preliminary log of some tests that have been run, presented here just for discussion purposes.

## Scenario A: Browser-based WASM using worker-based threads

Q: Clock times seem much less useful for profiling in WASM?

### Fib(70) x 0 threads:

Q: Fib(70) is not accurate. How is `unsigned long` treated in WASM?

```
Fib(70) is 885444751 - calculated in 0.000000 ms
Total duration: 2.000000 ms
```

### Fib(70) x 1 threads:

```
Fib(70) is 885444751 - calculated in 0.000000 ms
Fib(70) is 885444751 - calculated in 0.000000 ms
Total duration: 3.000000 ms
```

### Fib(70) x 2 threads:

```
Fib(70) is 885444751 - calculated in 0.000000 ms
Fib(70) is 885444751 - calculated in 0.000000 ms
Fib(70) is 885444751 - calculated in 0.000000 ms
Total duration: 4.000000 ms
```

### Fib(9999) x 1 threads - Memory growth sensitivity

The following run-time error was raised when attempting to find Fib(9999) in a worker thread:

```
Cannot enlarge memory arrays to size 17842176 bytes (OOM). Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value 16777216, (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0
```

The following compilation error was raised using the `ALLOW_MEMORY_GROWTH=1` compilation flag:

```
$ emcc threads.c -s WASM=1 -s USE_PTHREADS=1 -s ALLOW_MEMORY_GROWTH=1  --emrun -o threads.html
root:WARNING: USE_PTHREADS + ALLOW_MEMORY_GROWTH may run non-wasm code slowly, see https://github.com/WebAssembly/design/issues/1271
shared:ERROR: If pthreads and memory growth are enabled, WASM_MEM_MAX must be set
```

Related gist: [WebAssembly pthreads + memory growth + JS](https://gist.github.com/kripken/949eab99b7bc34f67c12140814d2b595)

## Scenario B: Native C using pthreads

### Fib(70) x 0 threads:

```
$ ./dist/native-c/threads 70 0
Fib(70) is 190392490709135 - calculated in 0.002000 ms
Total duration: 0.047000 ms
```

### Fib(70) x 1 threads:

```
$ ./dist/native-c/threads 70 1
Fib(70) is 190392490709135 - calculated in 0.001000 ms
Fib(70) is 190392490709135 - calculated in 0.001000 ms
Total duration: 0.131000 ms
```

### Fib(70) x 2 threads:

```
$ ./dist/native-c/threads 70 2
Fib(70) is 190392490709135 - calculated in 0.000000 ms
Fib(70) is 190392490709135 - calculated in 0.002000 ms
Fib(70) is 190392490709135 - calculated in 0.005000 ms
Total duration: 0.210000 ms
```

### Fib(70) x 3 threads:

```
$ ./dist/native-c/threads 70 3
Fib(70) is 190392490709135 - calculated in 0.001000 ms
Fib(70) is 190392490709135 - calculated in 0.007000 ms
Fib(70) is 190392490709135 - calculated in 0.008000 ms
Fib(70) is 190392490709135 - calculated in 0.001000 ms
Total duration: 0.340000 ms
```

### Fib(70) x 5 threads:

```
$ ./dist/native-c/threads 70 5
Fib(70) is 190392490709135 - calculated in 0.003000 ms
Fib(70) is 190392490709135 - calculated in 0.003000 ms
Fib(70) is 190392490709135 - calculated in 0.001000 ms
Fib(70) is 190392490709135 - calculated in 0.002000 ms
Fib(70) is 190392490709135 - calculated in 0.004000 ms
Fib(70) is 190392490709135 - calculated in 0.004000 ms
Total duration: 0.525000 ms
```

### Fib(70) x 10 threads:

```
$ ./dist/native-c/threads 70 10
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

### Fib(9999) x 1 thread:

Note: Fib(9999) overflows `unsigned long` so the answer is not accurate.

```
$ ./dist/native-c/threads 9999 1
Fib(9999) is 2788724563990792802 - calculated in 0.009000 ms
Fib(9999) is 2788724563990792802 - calculated in 0.017000 ms
Total duration: 0.174000 ms
```

### Fib(9999) x 10 threads:

Note: Fib(9999) overflows `unsigned long` so the answer is not accurate.

```
$ ./dist/native-c/threads 9999 10
Fib(9999) is 2788724563990792802 - calculated in 0.013000 ms
Fib(9999) is 2788724563990792802 - calculated in 0.047000 ms
Fib(9999) is 2788724563990792802 - calculated in 0.029000 ms
Fib(9999) is 2788724563990792802 - calculated in 0.031000 ms
Fib(9999) is 2788724563990792802 - calculated in 0.025000 ms
Fib(9999) is 2788724563990792802 - calculated in 0.032000 ms
Fib(9999) is 2788724563990792802 - calculated in 0.031000 ms
Fib(9999) is 2788724563990792802 - calculated in 0.142000 ms
Fib(9999) is 2788724563990792802 - calculated in 0.017000 ms
Fib(9999) is 2788724563990792802 - calculated in 0.011000 ms
Fib(9999) is 2788724563990792802 - calculated in 0.010000 ms
Total duration: 0.897000 ms
```
