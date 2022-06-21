//Init draggable items
let items = document.querySelectorAll('.todo-element');
items.forEach(current_item => 
{
    current_item.addEventListener('dragstart', dragStart)
    current_item.addEventListener('dragend', dragEnd)
});
update_item_left();
add_new_task("Clean the flat");
add_new_task("buy a new computer");
add_new_task("go to training club");

function dragStart(e) 
{
    e.dataTransfer.setData('text/plain', ""+e.target.id);
    setTimeout(() => {e.target.classList.add('is-dropping');}, 0);
    
    items.forEach(current_item =>//we avoid any child from a todo item to interact with dragin item
    {
        var children = Array.prototype.slice.call(current_item.children);
        children.forEach(child => {child.classList.add('ignore_element');});
    });
}
function dragEnd(e) 
{ 
    e.target.classList.remove('is-dropping');
    items.forEach(current_item => 
    {
        var children = Array.prototype.slice.call(current_item.children);
        children.forEach(child => {child.classList.remove('ignore_element');});
    });
}

//Get current element overlaping
let current_overlapping_element = null;
items.forEach(current_item => 
{
    current_item.addEventListener('dragenter', dragEnter)
    current_item.addEventListener('dragover', dragOver);
    current_item.addEventListener('dragleave', dragLeave);
    current_item.addEventListener('drop', drop);
});

function dragEnter(e) 
{
    e.preventDefault();
    e.target.classList.add('drag-over');
}
function dragOver(e) {e.preventDefault();}
function dragLeave(e) 
{
    e.target.classList.remove('drag-over');
}
function drop(e) 
{    
    e.target.classList.remove('is-dropping');
    e.target.classList.remove('drag-over');

    const id = e.dataTransfer.getData('text/plain');
    const drop_item = document.getElementById(id);

    // add it just under the overlaped element
    e.target.after(drop_item);

    // display the draggable element as before
    drop_item.classList.remove('hide');
}

//ADD NEW TODO
document.getElementById("input_todo").addEventListener("keypress", (event) =>
{
    if (event.key === "Enter") 
        add_new_task();
});

function add_new_task(task_text = "")
{
    let unique_id = (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
    let new_todo = document.getElementById("todo_template").cloneNode(true); 
    new_todo.classList.add("todo-element");
    new_todo.id = "todo-" + unique_id;
    new_todo.querySelector("input").id = "checkbox_todo"+unique_id;
    new_todo.querySelector("label").htmlFor  = "checkbox_todo"+unique_id;
    
    if(task_text == "")
        new_todo.querySelector("label").innerText = document.getElementById("input_todo").value;
    else new_todo.querySelector("label").innerText = task_text;
    new_todo.querySelector("input").checked = false;

    //checkbox event    
    new_todo.querySelector("input").addEventListener('change', ()=> 
    {
        update_item_left();
        if(new_todo.querySelector("input").checked)
        {
            new_todo.querySelector("label").classList.add("checked");
        }
        else new_todo.querySelector("label").classList.remove("checked");
            
    });

    //drag n drop events
    new_todo.addEventListener('dragstart', dragStart)
    new_todo.addEventListener('dragend', dragEnd)
    new_todo.addEventListener('dragenter', dragEnter)
    new_todo.addEventListener('dragover', dragOver);
    new_todo.addEventListener('dragleave', dragLeave);
    new_todo.addEventListener('drop', drop);

    //delete toto
    new_todo.querySelector(".delete-btn").addEventListener('click', ()=> 
    {            
        document.getElementById("todo-list").removeChild(new_todo);
        update_item_left()
    });

    document.getElementById("todo-list").appendChild(new_todo); 
    update_item_left();
}

function update_item_left()
{   
    items = document.querySelectorAll('.todo-element');
    
    if(items.length > 0)
    {        
        document.getElementById('todo-footer').style.display = "flex";
    }
    else 
    {
        console.log(items.length);
        document.getElementById('todo-footer').style.display = "none";
    }

    let nb = items.length;
    items.forEach(current_item =>
    {
        if(current_item.querySelector("input").checked) 
            nb--;                    
    });  
    document.getElementById("nb-items-left").innerText = nb + " items left";    
}

//FILTERS
//ACTIVE
document.getElementById("active-filter").addEventListener("click", () =>
{
    items.forEach(current_item =>
    {
        if(!current_item.querySelector("input").checked)
        {
            current_item.style.display = "block";
        }            
        else current_item.style.display = "none";
    });  
});

//COMPLETED
document.getElementById("completed-filter").addEventListener("click", () =>
{
    items.forEach(current_item =>
    {
        if(current_item.querySelector("input").checked)
        {
            current_item.style.display = "block";
        }            
        else current_item.style.display = "none";
    });  
});

//all
document.getElementById("all-filter").addEventListener("click", () =>
{
    items.forEach(current_item =>
    {
        current_item.style.display = "block";
    });  
});

//Clear completed
document.getElementById("clear-completed-btn").addEventListener("click", () =>
{
    items.forEach(current_item =>
    {
        if(current_item.querySelector("input").checked)
        {            
            document.getElementById("todo-list").removeChild(current_item);
        }   
    }); 
    update_item_left();
});

//Theme switch
let isDarkTheme = false;
document.getElementById("switch-theme").addEventListener("click", () =>
{
    isDarkTheme= !isDarkTheme;
    if(isDarkTheme)
        document.querySelector("main").classList.add("dark");
    else document.querySelector("main").classList.remove("dark");
});

