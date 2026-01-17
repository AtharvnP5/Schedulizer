const calendarGrid = document.querySelector(".calendar-grid");
const monthYear = document.getElementById("month-year");
const selectedDateText = document.getElementById("selected-date-text");

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const todoPanel = document.getElementById("todo-panel");

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDate = null;

let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getDateKey(date) {
    return date.toISOString().split("T")[0];
}

function renderCalendar(month, year) {
    calendarGrid.innerHTML = "";
    monthYear.textContent = `${months[month]} ${year}`;

    selectedDate = null;
    selectedDateText.textContent = "Tasks";
    taskList.innerHTML = "";
    todoPanel.classList.add("hidden");

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
            selectDate(day, month, year, dateCell);
        });

        calendarGrid.appendChild(dateCell);
    }
}

function selectDate(day, month, year, element) {
    document.querySelectorAll(".date").forEach(d =>
        d.classList.remove("selected")
    );

    element.classList.add("selected");

    selectedDate = new Date(year, month, day);
    selectedDateText.textContent =
        `Tasks for ${day} ${months[month]} ${year}`;

    todoPanel.classList.remove("hidden");
    renderTasks();
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

        const delBtn = document.createElement("button");
        delBtn.textContent = "X";
        delBtn.onclick = (e) => {
            e.stopPropagation();
            dayTasks.splice(index, 1);
            saveTasks();
            renderTasks();
        };

        li.appendChild(delBtn);
        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener("click", () => {
    if (!selectedDate || taskInput.value.trim() === "") return;

    const dateKey = getDateKey(selectedDate);
    tasks[dateKey] = tasks[dateKey] || [];

    tasks[dateKey].push({ text: taskInput.value, done: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
});

document.getElementById("prev-month").onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
};

document.getElementById("next-month").onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
};

renderCalendar(currentMonth, currentYear);
