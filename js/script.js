// =========================
// CUSTOM NAME
// =========================

let userName = localStorage.getItem("username");

if(!userName){

  userName = prompt("Enter your name:");

  if(userName === "" || userName === null){
    userName = "User";
  }

  localStorage.setItem("username", userName);
}

// =========================
// CLOCK & GREETING
// =========================

function updateClock(){

  const now = new Date();

  // TIME
  const time = now.toLocaleTimeString();
  document.getElementById("time").innerText = time;

  // DATE
  const date = now.toDateString();
  document.getElementById("date").innerText = date;

  // GREETING
  const hour = now.getHours();

  let greeting = "";

  if(hour < 12){
    greeting = "Good Morning";
  }else if(hour < 18){
    greeting = "Good Afternoon";
  }else{
    greeting = "Good Evening";
  }

  document.getElementById("greeting").innerText =
  `${greeting}, ${userName}`;
}

setInterval(updateClock,1000);

updateClock();


// =========================
// FOCUS TIMER
// =========================

let timeLeft = 25 * 60;
let timerInterval;

function updateTimerDisplay(){

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  document.getElementById("timer").innerText =
  `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

document.getElementById("startBtn").onclick = function(){

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {

    if(timeLeft > 0){

      timeLeft--;

      updateTimerDisplay();

    }

  },1000);
};

document.getElementById("stopBtn").onclick = function(){

  clearInterval(timerInterval);
};

document.getElementById("resetBtn").onclick = function(){

  clearInterval(timerInterval);

  timeLeft = 25 * 60;

  updateTimerDisplay();
};

updateTimerDisplay();


// =========================
// TODO LIST
// =========================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks(){

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(){

  taskList.innerHTML = "";

  tasks.forEach((task,index)=>{

    const li = document.createElement("li");

    const leftDiv = document.createElement("div");
    leftDiv.classList.add("task-left");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    checkbox.onchange = function(){

      task.done = !task.done;

      saveTasks();
      renderTasks();
    };

    const span = document.createElement("span");
    span.innerText = task.text;

    if(task.done){
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.5";
    }

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("task-buttons");

    // EDIT BUTTON
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";

    editBtn.onclick = function(){

      const newTask = prompt("Edit task:", task.text);

      if(newTask !== null && newTask.trim() !== ""){

        const duplicate = tasks.some((t,i)=>
          t.text.toLowerCase() === newTask.toLowerCase() && i !== index
        );

        if(duplicate){
          alert("Task already exists!");
          return;
        }

        task.text = newTask;

        saveTasks();
        renderTasks();
      }
    };

    // DELETE BUTTON
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";

    deleteBtn.onclick = function(){

      tasks.splice(index,1);

      saveTasks();
      renderTasks();
    };

    buttonDiv.appendChild(editBtn);
    buttonDiv.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(buttonDiv);

    taskList.appendChild(li);
  });
}

addTaskBtn.onclick = function(){

  const text = taskInput.value.trim();

  if(text === ""){
    return;
  }

  // PREVENT DUPLICATE
  const duplicate = tasks.some(task =>
    task.text.toLowerCase() === text.toLowerCase()
  );

  if(duplicate){
    alert("Task already exists!");
    return;
  }

  tasks.push({
    text:text,
    done:false
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
};

renderTasks();


// =========================
// QUICK LINKS
// =========================

const linkName = document.getElementById("linkName");
const linkUrl = document.getElementById("linkUrl");
const addLinkBtn = document.getElementById("addLinkBtn");
const linksContainer = document.getElementById("linksContainer");

let links = JSON.parse(localStorage.getItem("links")) || [];

function saveLinks(){

  localStorage.setItem("links", JSON.stringify(links));
}

function renderLinks(){

  linksContainer.innerHTML = "";

  links.forEach(link => {

    const a = document.createElement("a");

    a.href = link.url;
    a.target = "_blank";
    a.innerText = link.name;

    a.classList.add("quick-link");

    linksContainer.appendChild(a);
  });
}

addLinkBtn.onclick = function(){

  if(linkName.value === "" || linkUrl.value === ""){
    return;
  }

  links.push({
    name:linkName.value,
    url:linkUrl.value
  });

  saveLinks();
  renderLinks();

  linkName.value = "";
  linkUrl.value = "";
};

renderLinks();