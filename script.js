//define variables
const add_task_input = document.getElementById("add-task-input");
const tasks_list = document.getElementById("tasks");
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

//start dark-light-theme button section
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
    if (add_task_input.value.trim() === ""){
        alert("you should type something and then hit the button ")
    }
    else{
        let newElement = document.createElement("li");
        newElement.draggable = true;
        newElement.ondragstart = drag;
        newElement.ondrop = drop;
        newElement.ondragover = allowDrop;
        newElement.ondragleave = leave;
        newElement.innerHTML = add_task_input.value.trim() + task_buttons;
        add_task_input.value = "";
        tasks_list.appendChild(newElement);
    }
}

//trigger add function by pressing enter in task input
add_task_input.addEventListener('keydown',function(event){
    if(event.key==='Enter')
        add_task();
});

//event listener for deleting , checking and editing
tasks_list.addEventListener('click', function(event) {
    if (event.target.closest('.edit-task-icon')) {
        // edit icon is clicked
    }
    else if (event.target.closest('.del-task-icon')) {
        // del icon is clicked
        event.target.closest('li').remove();
    }
    else if (event.target.closest('.task_check')) {
        // check icon is clicked
        event.target.closest('li').classList.toggle('checked');
    }
});

// drag and drop functions
function allowDrop(event) {
    event.preventDefault();
    const target = event.target.closest('li');
    if (target && !target.classList.contains('placeholder')) {
        target.classList.add('placeholder');
    }
}

function leave(event) {
    const target = event.target.closest('li');
    if (target && target.classList.contains('placeholder')) {
        target.classList.remove('placeholder');
    }
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

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
    leave(event); // remove placeholder class after drop
}

// assign unique IDs to tasks
function assignTaskIds() {
    const tasks = tasks_list.children;
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].id = 'task-' + i;
    }
}

// update task IDs when a new task is added or tasks are rearranged
new MutationObserver(assignTaskIds).observe(tasks_list, { childList: true});

// initialize task IDs for existing tasks
assignTaskIds();