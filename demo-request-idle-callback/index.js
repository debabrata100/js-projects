!(function () {
  const state = {
    numberOfBoxes: 1,
  };
  const boxes = document.querySelector(".boxes");

  document.querySelector("#addNew").addEventListener("click", () => {
    const li = document.createElement("li");
    li.classList.add("box");
    const { numberOfBoxes } = state;
    if (numberOfBoxes % 2 !== 0) {
      li.classList.add("green");
    }
    boxes.appendChild(li);
    state.numberOfBoxes = numberOfBoxes + 1;
    console.log("child appened");
  });

  let enableResponsive = false;
  document
    .querySelector("#enable-responsiveness")
    .addEventListener("change", (e) => {
      enableResponsive = e.target.checked;
    });
  let tasks = [];
  let taskStatus = 0;
  let totalTasks = 200;
  let stop = false;
  const defaultSlowTaskDelay = 100;
  function slowTask(delay = defaultSlowTaskDelay) {
    return function () {
      let before = Date.now();
      while (Date.now() - before < delay) {
        // do nothing
      }
    };
  }
  function createLongTask() {
    tasks = [];
    for (let i = 0; i < totalTasks; i++) {
      tasks.push(slowTask());
    }
  }
  function updateProgressBar() {
    const progress = document.querySelector("#progress");
    const progressValue = document.querySelector("#progressValue");
    progress.style.width = `${taskStatus}%`;
    progressValue.innerText = `${taskStatus} %`;
  }

  function scheduleUpdateProgressBar() {
    requestAnimationFrame(updateProgressBar);
  }
  const req = window.requestIdleCallback;

  function runBlockingTask() {
    while (tasks.length > 0) {
      const task = tasks.shift();
      task();
      taskStatus = Math.floor(((totalTasks - tasks.length) / totalTasks) * 100);
      scheduleUpdateProgressBar();
    }
  }
  function runTasks(deadine) {
    // console.log("outside loop", deadine.timeRemaining());
    while (
      tasks.length > 0 &&
      (deadine.timeRemaining() > 0 || deadine.didTimeout) &&
      !stop
    ) {
      const task = tasks.shift();
      task();
      // console.log("insite loop", deadine.timeRemaining());
      taskStatus = Math.floor(((totalTasks - tasks.length) / totalTasks) * 100);
      scheduleUpdateProgressBar();
    }
    if (tasks.length > 0 && !stop) {
      // console.log("started again");
      req(runTasks, { timeout: 5000 });
    }
  }

  document.querySelector("#startLongTask").addEventListener("click", () => {
    createLongTask();
    const runner = enableResponsive ? runTasks : runBlockingTask;
    req(runner, { timeout: 1000 });
  });
  document.querySelector("#stop").addEventListener("click", () => {
    stop = true;
  });
  document.querySelector("#resume").addEventListener("click", () => {
    stop = false;
    const runner = enableResponsive ? runTasks : runBlockingTask;
    req(runner, { timeout: 1000 });
  });
})();
