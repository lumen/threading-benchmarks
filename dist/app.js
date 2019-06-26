import {
  performAlgorithmInJS,
  prepareJSWorkers,
  terminateJSWorkers
} from "./js/main.js";
import {
  ALGORITHM_FIRST,
  ALGORITHM_LAST,
  algorithmName
} from "./js/algorithms/algorithms.js";

const SCENARIO_FIRST = 0;
const SCENARIO_JS_SPAWN_THREADS = 0;
const SCENARIO_JS_REUSE_THREADS = 1;
const SCENARIO_WASM_REUSE_THREADS = 2;
const SCENARIO_LAST = 2;

function scenarioName(scenario) {
  switch (scenario) {
    case SCENARIO_JS_SPAWN_THREADS:
      return "JS - Spawn threads";
    case SCENARIO_JS_REUSE_THREADS:
      return "JS - Reuse threads";
    case SCENARIO_WASM_REUSE_THREADS:
      return "WASM - Reuse threads";
  }
}

function renderScenarios() {
  let container = document.getElementById("scenarios");
  for (let i = SCENARIO_FIRST; i <= SCENARIO_LAST; i++) {
    let li = document.createElement("li");
    let input = document.createElement("input");
    input.id = `scenario${i}`;
    input.type = "checkbox";
    input.checked = true;
    let label = document.createElement("label");
    label.htmlFor = `scenario${i}`;
    label.innerText = scenarioName(i);
    li.appendChild(input);
    li.appendChild(label);
    container.appendChild(li);
  }
}

function renderAlgorithms() {
  let container = document.getElementById("algorithms");
  for (let i = ALGORITHM_FIRST; i <= ALGORITHM_LAST; i++) {
    let li = document.createElement("li");
    let input = document.createElement("input");
    input.id = `alg${i}`;
    input.type = "checkbox";
    input.checked = true;
    let label = document.createElement("label");
    label.htmlFor = `alg${i}`;
    label.innerText = algorithmName(i);
    li.appendChild(input);
    li.appendChild(label);
    container.appendChild(li);
  }
}

function renderResults(selections, results) {
  const { scenarios, algorithms, threads, iterations } = selections;
  const container = document.getElementById("results-container");
  const table = document.createElement("table");
  table.className = "results";
  const timeFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 4
  });
  let tr, th, td;

  const thead = document.createElement("thead");
  tr = document.createElement("tr");
  th = document.createElement("th");
  th.colSpan = 2;
  tr.appendChild(th);
  threads.forEach(t => {
    th = document.createElement("th");
    th.innerText = `Threads: ${t}`;
    th.colSpan = iterations.length;
    tr.appendChild(th);
  });
  thead.appendChild(tr);

  tr = document.createElement("tr");
  th = document.createElement("th");
  th.colSpan = 2;
  tr.appendChild(th);
  threads.forEach(t => {
    iterations.forEach(i => {
      let th = document.createElement("th");
      th.innerText = `${i}`;
      tr.appendChild(th);
    });
  });
  thead.appendChild(tr);

  const tbody = document.createElement("tbody");
  scenarios.forEach(s => {
    s = scenarioName(s);
    let tr1 = document.createElement("tr");
    tr1.className = "scenario";
    th = document.createElement("th");
    th.innerText = s;
    th.rowSpan = algorithms.length;
    tr1.appendChild(th);
    tr = null;

    algorithms.forEach(a => {
      a = algorithmName(a);

      if (tr === null) {
        tr = tr1;
      } else {
        tr = document.createElement("tr");
        tbody.appendChild(tr);
      }

      th = document.createElement("th");
      th.innerText = a;
      tr.appendChild(th);

      threads.forEach(t => {
        iterations.forEach(i => {
          td = document.createElement("td");
          td.innerText = timeFormatter.format(results[s][a][`${t}`][`${i}`]);
          tr.appendChild(td);
        });
      });

      tbody.appendChild(tr);
    });
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}

function selectedAlgorithms() {
  let algorithms = [];
  for (let i = ALGORITHM_FIRST; i <= ALGORITHM_LAST; i++) {
    let input = document.getElementById(`alg${i}`);
    if (input.checked) {
      algorithms.push(i);
    }
  }
  return algorithms;
}

function selectedScenarios() {
  let scenarios = [];
  for (let i = SCENARIO_FIRST; i <= SCENARIO_LAST; i++) {
    let input = document.getElementById(`scenario${i}`);
    if (input.checked) {
      scenarios.push(i);
    }
  }
  return scenarios;
}

function selectedIterations() {
  let minIterations = parseInt(document.getElementById("minIterations").value);
  let maxIterations = parseInt(document.getElementById("maxIterations").value);
  let step = parseInt(document.getElementById("stepIterations").value);
  let iterations = [];
  for (let i = minIterations; i <= maxIterations; i += step) {
    iterations.push(i);
  }
  return iterations;
}

function selectedThreads() {
  let minThreads = parseInt(document.getElementById("minThreads").value);
  let maxThreads = parseInt(document.getElementById("maxThreads").value);
  let threads = [];
  for (let t = minThreads; t <= maxThreads; t++) {
    threads.push(t);
  }
  return threads;
}

async function prepareScenarioOptions(scenario, maxThreads) {
  switch (scenario) {
    case SCENARIO_JS_SPAWN_THREADS:
      return;

    case SCENARIO_JS_REUSE_THREADS:
      return {
        workers: prepareJSWorkers(maxThreads)
      };

    case SCENARIO_WASM_REUSE_THREADS:
      return;
  }
}

async function teardownScenario(scenario, options) {
  switch (scenario) {
    case SCENARIO_JS_SPAWN_THREADS:
      return;

    case SCENARIO_JS_REUSE_THREADS:
      await terminateJSWorkers(options.workers);
      return;

    case SCENARIO_WASM_REUSE_THREADS:
      return;
  }
}

async function performScenario(scenario, a, t, i, options) {
  switch (scenario) {
    case SCENARIO_JS_SPAWN_THREADS:
    case SCENARIO_JS_REUSE_THREADS:
      return await performAlgorithmInJS(a, t, i, options);

    case SCENARIO_WASM_REUSE_THREADS:
      return await Module.callMain([`${a}`, `${t}`, `${i}`]);
  }
}

function getSelections() {
  return {
    scenarios: selectedScenarios(),
    algorithms: selectedAlgorithms(),
    threads: selectedThreads(),
    iterations: selectedIterations()
  };
}

async function performAll(selections) {
  const options = {};
  const { scenarios, algorithms, threads, iterations } = selections;
  const results = {};

  for (let s of scenarios) {
    options[s] = await prepareScenarioOptions(s, threads[threads.length - 1]);
  }

  for (let s of scenarios) {
    let sName = scenarioName(s);
    results[sName] = {};

    for (let a of algorithms) {
      let aName = algorithmName(a);
      results[sName][aName] = {};

      for (let t of threads) {
        results[sName][aName][t] = {};

        for (let i of iterations) {
          let start = performance.now();
          await performScenario(s, a, t, i, options[s]);
          let finished = performance.now();
          results[sName][aName][t][i] = finished - start;

          // console.log(scenarioName(s), algorithmName(a), t, i, finished - start);
        }
      }
    }
  }

  for (let s of scenarios) {
    options[s] = await teardownScenario(s, options[s]);
  }

  return results;
}

export function renderApp() {
  renderAlgorithms();
  renderScenarios();
  document.getElementById("run").addEventListener("click", async function() {
    const selections = getSelections();
    const results = await performAll(selections);
    console.log(results);
    renderResults(selections, results);
  });
}
