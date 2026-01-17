const calendarGrid = document.querySelector(".calendar-grid");
const monthYear = document.getElementById("month-year");
const selectedDateText = document.getElementById("selected-date-text");
const todoPanel = document.getElementById("todo-panel");


const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDate = null;

const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// All tasks stored here
let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function renderCalendar(month, year) {
    calendarGrid.innerHTML = "";
    monthYear.textContent = `${months[month]} ${year}`;

    selectedDate = null;
    selectedDateText.textContent = "Tasks";
    taskList.innerHTML = "";


    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendarGrid.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateCell = document.createElement("div");
        dateCell.classList.add("date");
        dateCell.textContent = day;

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dateCell.classList.add("today");
        }

        dateCell.addEventListener("click", () => {
            selectDate(day, month, year);
        });

        calendarGrid.appendChild(dateCell);
    }
}

prevMonthBtn.addEventListener("click", () => {
    currentMonth--;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener("click", () => {
    currentMonth++;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendar(currentMonth, currentYear);
});


function selectDate(day, month, year) {
    
    document.querySelectorAll(".date").forEach(d =>
        d.classList.remove("selected")
    );

    document.querySelectorAll(".date").forEach(d => {
        if (parseInt(d.textContent) === day) {
            d.classList.add("selected");
        }
    });

    selectedDate = new Date(year, month, day);

    selectedDateText.textContent =
        `Tasks for ${day} ${months[month]} ${year}`;
    todoPanel.classList.remove("hidden");
    renderTasks();
}

function getDateKey(date) {
    return date.toISOString().split("T")[0];
}

function renderTasks() {
    taskList.innerHTML = "";

    if (!selectedDate) return;

    const dateKey = getDateKey(selectedDate);
    const dayTasks = tasks[dateKey] || [];

    dayTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;

        if (task.done) li.classList.add("completed");

        li.addEventListener("click", () => {
          task.done = !task.done;
          saveTasks();
          renderTasks();
       });


        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";

        deleteBtn.addEventListener("click", (e) => {
         e.stopPropagation();
        dayTasks.splice(index, 1);
        saveTasks();
        renderTasks();
        });


              li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener("click", () => {
    if (!selectedDate || taskInput.value.trim() === "") return;

    const dateKey = getDateKey(selectedDate);

         if (!tasks[dateKey]) {
        tasks[dateKey] = [];
    }

    tasks[dateKey].push({
        text: taskInput.value,
        done: false
    });
    saveTasks();


    taskInput.value = "";
    renderTasks();
});

// Initial calendar render
renderCalendar(currentMonth, currentYear);
