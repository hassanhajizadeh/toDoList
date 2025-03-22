//define variables
const add_task_input = document.getElementById("add-task-input");
const add_task_reminder = document.getElementById("add-task-reminder");
const tasks_list = document.getElementById("tasks");

//element that currently editing
let currentlyEditingTask = null;

//task manipulation icons (delete , edit and check)
const task_buttons = `
    <div class="task-icons">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="edit-task-icon">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="del-task-icon">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
        <input type="checkbox" class='task_check'>
    </div>
`;

//dark-light-theme function to changing the colors palette
// to dark or light and moving the bullet inside the dark-light-theme button
function darkThemeBtnToggle(){
    const light_btn = document.getElementById('dark-theme-btn');
    const bullet = document.getElementById("bullet");
    if (!light_btn.checked) {
        document.documentElement.style.setProperty("--background", getComputedStyle(document.documentElement).getPropertyValue("--dark-background"));
        document.documentElement.style.setProperty("--primary-text", getComputedStyle(document.documentElement).getPropertyValue("--dark-primary-text"));
        document.documentElement.style.setProperty("--secondary-text", getComputedStyle(document.documentElement).getPropertyValue("--dark-secondary-text"));
        document.documentElement.style.setProperty("--task-background", getComputedStyle(document.documentElement).getPropertyValue("--dark-task-background"));
        document.documentElement.style.setProperty("--completed-task", getComputedStyle(document.documentElement).getPropertyValue("--dark-completed-task"));
        document.documentElement.style.setProperty("--accent-color", getComputedStyle(document.documentElement).getPropertyValue("--dark-accent-color"));
        document.documentElement.style.setProperty("--button-background", getComputedStyle(document.documentElement).getPropertyValue("--dark-button-background"));
        document.documentElement.style.setProperty("--button-hover", getComputedStyle(document.documentElement).getPropertyValue("--dark-button-hover"));
        bullet.style.transform = "none";
    } else {
        document.documentElement.style.setProperty("--background", getComputedStyle(document.documentElement).getPropertyValue("--light-background"));
        document.documentElement.style.setProperty("--primary-text", getComputedStyle(document.documentElement).getPropertyValue("--light-primary-text"));
        document.documentElement.style.setProperty("--secondary-text", getComputedStyle(document.documentElement).getPropertyValue("--light-secondary-text"));
        document.documentElement.style.setProperty("--task-background", getComputedStyle(document.documentElement).getPropertyValue("--light-task-background"));
        document.documentElement.style.setProperty("--completed-task", getComputedStyle(document.documentElement).getPropertyValue("--light-completed-task"));
        document.documentElement.style.setProperty("--accent-color", getComputedStyle(document.documentElement).getPropertyValue("--light-accent-color"));
        document.documentElement.style.setProperty("--button-background", getComputedStyle(document.documentElement).getPropertyValue("--light-button-background"));
        document.documentElement.style.setProperty("--button-hover", getComputedStyle(document.documentElement).getPropertyValue("--light-button-hover"));
        bullet.style.transform = "translateX(20px)";
    }
}

// add task
function add_task(){
    if (add_task_input.value.trim() === ""){ //checks if task name is set
        alert("You should type something and then hit the button");
    }
    else if (add_task_reminder.value === ""){ //checks if task timer is set
        alert("You should set a reminder date and time");
    }
    else { //adding new task by creating an li element
        let newElement = document.createElement("li"); 
        newElement.draggable = true; //make element draggable
        newElement.ondragstart = drag;      //assigning functions for each drag and drop scenario 
        newElement.ondrop = drop;           //assigning functions for each drag and drop scenario 
        newElement.ondragover = dragOver;  //assigning functions for each drag and drop scenario 
        newElement.ondragleave = leave;     //assigning functions for each drag and drop scenario 

        //inserting task-name , task-reminder-date and task buttons (edit , delete , check) in new element
        newElement.innerHTML = `
            <p class='task-name'>${add_task_input.value.trim()}</p>
            <span class="task-reminder">${new Date(add_task_reminder.value).toLocaleString()}</span>
            ${task_buttons}
        `;

        // Setting a custom 'data-reminder' attribute on the new element, with the value of entered reminder date in seconds
        newElement.setAttribute('data-reminder', new Date(add_task_reminder.value).getTime());

        // removing and setting by default the input content in add task section
        add_task_input.value = "";
        add_task_reminder.value = "2099-12-20T00:00";

        //adding the task to the tasks list
        tasks_list.appendChild(newElement);
    }
    save_data(); //saving the data of task in an external file
}

// saving the data of tasks container in a external file 
function save_data(){
    sessionStorage.setItem("tasks_data", tasks_list.innerHTML);
}

//trigger add function by pressing enter in task input
add_task_input.addEventListener('keydown', function(event){
    if(event.key === 'Enter')
        add_task();
});

//event listener for deleting, checking, and editing
tasks_list.addEventListener('click', function(event) {
    // checks if the clicked element is the edit icon
    if (event.target.closest('.edit-task-icon')) {
        
        // if a task is already being edited, save it before editing a new one
        if (currentlyEditingTask !== null) {
            saveTask(currentlyEditingTask);
        }

        // gets the task element (the closest <li> parent)
        const task = event.target.closest('li');
        // extracts the current task text and reminder text of the 
        const taskText = task.querySelector('.task-name').textContent.trim();
        const reminderText = task.querySelector('.task-reminder').textContent.trim();
        //changing the task content for editing data
        task.innerHTML = `
            <div class="edit-inputs-container">
                <input type="text" class="edit-task-input" value="${taskText}" />
                <input type="datetime-local" class="edit-task-reminder" value="${new Date(reminderText).toISOString().slice(0, 16)}" />
            </div>
            ${task_buttons}
        `;

        task.classList.add('task-on-edit');
        //adding the task to currently editing task
        currentlyEditingTask = task;

        //disabling checkbox during edit
        task.lastElementChild.lastElementChild.disabled = true;
        task.lastElementChild.lastElementChild.style.cursor = "not-allowed";
        
        const editTaskInput = task.querySelector('.edit-task-input');
        const editTaskReminder = task.querySelector('.edit-task-reminder');

        editTaskInput.focus();
        
        //shows date-time picker when clicking on the editTaskReminder input
        editTaskReminder.addEventListener("focus", function() {
            if (this.showPicker) {
                this.showPicker();
            }
        });
        
        //save task when enter key pressed in edit task name input
        editTaskInput.addEventListener('keydown', function(event) {
            if(event.key === 'Enter') {
                saveTask(task);
            }
        });
    }
    //deleting targeted task
    else if (event.target.closest('.del-task-icon')) {
        // del icon is clicked
        event.target.closest('li').remove();
    }

    //changing targeted task class to ckecked
    else if (event.target.closest('.task_check')) {
        // toggling li class to checked and unchecked
        event.target.closest('li').classList.toggle('checked');

        // Save the checkbox's checked state in the HTML attribute,  
        // so it can be retrieved later from sessionStorage.
        if(event.target.closest('li').classList.contains('checked')){
            event.target.closest('.task_check').setAttribute("checked", "checked");
            event.target.closest('li').classList.add('reminded');
        }
        else{
            event.target.closest('.task_check').removeAttribute("checked");
            event.target.closest('li').classList.remove('reminded');
        }
    }
    save_data();
});

//event listener for clicking on add-task-reminder input to show local date-time picker
document.getElementById('add-task-reminder').addEventListener("focus", function() {
    if (this.showPicker) {
        this.showPicker();
    }
});

// detects clicks outside the currently edited task and saves the task if the click is not on the task or its edit icon.
document.addEventListener('click', function(event) {
    if (currentlyEditingTask !== null && !currentlyEditingTask.contains(event.target) && !event.target.closest('.edit-task-icon')) {
        saveTask(currentlyEditingTask);
    }
});

//saving task and null the curretly editing task
function saveTask(task) {
    const editTaskInput = task.querySelector('.edit-task-input');
    const editTaskReminder = task.querySelector('.edit-task-reminder');
    if (editTaskInput && editTaskReminder) {
        task.classList.remove('task-on-edit');
        task.innerHTML = `
            <p class='task-name'>${editTaskInput.value.trim()}</p>
            <span class="task-reminder">${new Date(editTaskReminder.value).toLocaleString()}</span>
            ${task_buttons}
        `;
        task.setAttribute('data-reminder', new Date(editTaskReminder.value).getTime());
        currentlyEditingTask = null;
    }
}

//drag and drop functions
// Allows dropping by preventing the default behavior and adding a 'placeholder' class to the nearest 'li' element.
function dragOver(event) {
    event.preventDefault();
    const target = event.target.closest('li');
    if (target && !target.classList.contains('placeholder')) {
        target.classList.add('placeholder');
    }
}

// Removes the 'placeholder' class when the dragged item leaves a list item.
function leave(event) {
    const target = event.target.closest('li');
    if (target && target.classList.contains('placeholder')) {
        target.classList.remove('placeholder');
    }
}

// Stores the dragged element's ID.
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Handles dropping by repositioning the dragged element within the list.
function drop(event) {
    event.preventDefault();
    const dragElement = document.getElementById(event.dataTransfer.getData("text"));
    const dropTarget = event.target.closest('li');
    if (dragElement && dropTarget && dragElement !== dropTarget) {
        const allTasks = Array.from(tasks_list.children);
        const dragIndex = allTasks.indexOf(dragElement);
        const dropIndex = allTasks.indexOf(dropTarget);
        if (dragIndex < dropIndex) {
            tasks_list.insertBefore(dragElement, dropTarget.nextSibling);
        } else {
            tasks_list.insertBefore(dragElement, dropTarget);
        }
    }
    // remove placeholder class after drop
    leave(event); 
}

// assign unique IDs to tasks
function assignTaskIds() {
    const tasks = tasks_list.children;
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].id = 'task-' + i;
        //saving the tasks that where editing
        saveTask(tasks[i]);
    }
}

// update task IDs when a new task is added or tasks are rearranged
new MutationObserver(assignTaskIds).observe(tasks_list, { childList: true});

// initialize task IDs for existing tasks
assignTaskIds();

// check reminders
function checkReminders() {
    const now = Date.now();
    const tasks = tasks_list.children;
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const reminderTime = parseInt(task.getAttribute('data-reminder'));
        if (reminderTime <= now && !task.classList.contains('reminded')) {
            alert(`Reminder: ${task.textContent.trim()}`);
            task.classList.add('reminded');
        }
    }
}

// check reminders every minute
setInterval(checkReminders, 60000);


// sort tasks
function sortTasks() {
    const sortOption = document.getElementById('sort').value;
    let tasks = Array.from(tasks_list.children);

    if (sortOption === 'latest') {
        tasks.sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]));
    } else if (sortOption === 'deadline') {
        tasks.sort((a, b) => parseInt(a.getAttribute('data-reminder')) - parseInt(b.getAttribute('data-reminder')));
    }

    for (let task of tasks) {
        tasks_list.appendChild(task);
    }
}

//retoring tasks from sessionStorage and rebinding drag and drop functionalities
function restoreTasks() {
    const savedTasks = sessionStorage.getItem("tasks_data");
    if (savedTasks) {
        tasks_list.innerHTML = savedTasks;
        rebindEventListeners(); // Rebind drag-and-drop listeners
    }
}

function rebindEventListeners() {
    document.querySelectorAll('li').forEach(task => {
        task.ondragstart = drag;      
        task.ondrop = drop;           
        task.ondragover = dragOver;  
        task.ondragleave = leave; 
        
    });
}
// Call restoreTasks on page load
window.onload = restoreTasks;
