// Select DOM elements
const taskInput = document.getElementById('taskInput');
const categoryInput = document.getElementById('categoryInput');
const dateInput = document.getElementById('dateInput');
const filterSelect = document.getElementById('filterSelect');
const taskList = document.getElementById('taskList');

// Load tasks from LocalStorage or initialize empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// --- HELPER FUNCTIONS ---

// Save current state to browser memory
function saveLocal() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Check if a date string is strictly in the past
function isOverdue(dateString) {
    if (!dateString) return false; 
    const today = new Date().toISOString().split('T')[0];
    return dateString < today;
}

// Check if a date string is strictly today
function isToday(dateString) {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
}

// --- CORE FUNCTIONS ---

function renderTasks() {
    taskList.innerHTML = ''; // Clear the list
    const filterValue = filterSelect.value; // Get current filter

    tasks.forEach(task => {
        // 1. Determine if task should be shown based on filter
        let shouldShow = false;

        if (filterValue === 'all') {
            shouldShow = true;
        } else if (filterValue === 'today') {
            shouldShow = isToday(task.date);
        } else if (filterValue === 'overdue') {
            shouldShow = isOverdue(task.date);
        } else {
            // Filter matches a category name (Work, Personal, etc.)
            shouldShow = task.category === filterValue;
        }

        if (!shouldShow) return; // Skip rendering if filter doesn't match

        // 2. Build the task HTML
        const li = document.createElement('li');
        const isTaskOverdue = isOverdue(task.date);
        
        // Add styling classes
        li.className = `task-item border-${task.category} ${isTaskOverdue ? 'overdue' : ''}`;
        
        li.innerHTML = `
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <span class="task-meta">
                    ${task.category} • ${task.date || 'No Date'} 
                    ${isTaskOverdue ? '(Overdue!)' : ''}
                </span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
        `;

        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if (text === '') {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(), // Generate a unique ID
        text: text,
        category: category,
        date: date
    };

    tasks.push(newTask);
    saveLocal();
    renderTasks();

    // Reset Inputs
    taskInput.value = '';
    dateInput.value = '';
}

function deleteTask(id) {
    // Filter out the task with the specific ID
    tasks = tasks.filter(task => task.id !== id);
    saveLocal();
    renderTasks();
}

// Trigger render when filter changes
function filterTasks() {
    renderTasks();
}

// Initial Render on page load
renderTasks();