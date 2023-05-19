const addForm = document.querySelector(".add");
const list = document.querySelector(".todos");
const mainList = document.querySelector(".todos1");
const search = document.querySelector(".search input");
const clock = document.querySelector(".clock");
const light = document.querySelector(".blight");
const dark = document.querySelector(".bdark");
const user = document.querySelector(".buser");
const completedTasks = document.querySelector(".completedTasks");
const remainingTasks = document.querySelector(".remainingTasks");
const totalTasks = document.querySelector(".totalTasks");
const body = document.querySelector("body");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.mode == "true") {
  body.classList.remove("bodyWhite");
  body.classList.add("bodyDark");
}

if (localStorage.getItem("tasks")) {
  tasks.map((task) => {
    generateTemplate(task);
  });
}

light.addEventListener("click", (e) => {
  if (body.classList == "bodyDark") {
    body.classList.remove("bodyDark");
    body.classList.add("bodyWhite");

    localStorage.setItem("mode", false);
  }
});

dark.addEventListener("click", (e) => {
  if (body.classList == "bodyWhite") {
    body.classList.remove("bodyWhite");
    body.classList.add("bodyDark");
  
    localStorage.setItem("mode", true);
  }
 
});

user.addEventListener("click", (e) => {
  window.open("https://www.linkedin.com/in/nthiwa-felix-04bb5724b/", "_blank");
});

addForm.addEventListener("submit", (e) => {
  const inputValue = addForm.add.value.trim();
  const time = new Date();

  if (inputValue == "") {
    return;
  }

  const task = {
    id: new Date().getTime(),
    name: inputValue,
    time: time,
    isCompleted: false,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  generateTemplate(task);
  addForm.reset();
  addForm.focus();

  countTasks();
});

function generateTemplate(task) {
  const now = new Date();
  let tick = null;

  if (task.isCompleted) {
    tick = "marked";
  }

  const html = `
  <li id=${
    task.id
  } class="list-group-item d-flex justify-content-between align-items-center text-light list ${tick}">
  <i class="fa-solid fa-check check"></i>
          <span>
          <span> ${task.name}, </span>
          <span class="time"> ${dateFns.distanceInWords(now, task.time, {
            addSuffix: true,
          })} </span>
          </span>
          <i class="far fa-trash-alt delete"></i>
  </li>
  `;

  list.innerHTML += html;

  countTasks();
}

list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const taskId = e.target.closest("li").id;
    removeTask(taskId);
  }

  if (e.target.classList.contains("check")) {
    const tickId = e.target.closest("li").id;
    markTask(tickId, e.target);
  }
});

mainList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
  }

  if (e.target.classList.contains("check")) {
    e.target.parentElement.classList.add("marked");
  }
});

function markTask(tickId, el) {
  const task = tasks.find((task) => task.id === parseInt(tickId));

  task.isCompleted = !task.isCompleted;

  if (task.isCompleted) {
    el.closest("li").classList.add("marked");
  } else {
    el.closest("li").classList.remove("marked");
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  const completedTasksArray = tasks.filter((task) => task.isCompleted === true);
  const totalTasks = tasks.length;
  const completedTasks = completedTasksArray.length;

  if (totalTasks === completedTasks && completedTasks >= 2) {
    alert("Congratulations, I'm proud of you!! 🎉🥰");
  }

  countTasks();
}

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));

  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById(taskId).remove();

  countTasks();
}

function countTasks() {
  const completedTasksArray = tasks.filter((task) => task.isCompleted === true);

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completedTasksArray.length;
  remainingTasks.textContent = tasks.length - completedTasksArray.length;
}

const filterTodos = (term) => {
  Array.from(list.children)
    .filter((todo) => !todo.textContent.toLowerCase().includes(term))
    .forEach((todo) => todo.classList.add("filtered"));

  Array.from(list.children)
    .filter((todo) => todo.textContent.toLowerCase().includes(term))
    .forEach((todo) => todo.classList.remove("filtered"));
};

search.addEventListener("keyup", () => {
  const term = search.value.trim().toLowerCase();
  filterTodos(term);
});

const tick = () => {
  const now = new Date();

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const html = `
  <span>${h}</span> :
  <span>${m}</span> :
  <span>${s}</span>, 
  <span style="margin-left: 10px">${dateFns.format(
    now,
    "ddd, Do MMM, YYYY"
  )}</span>
  `;

  clock.innerHTML = html;
};

window.setInterval(tick, 1000);
