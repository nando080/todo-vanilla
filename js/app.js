const filterButtonEl = document.querySelector('.l-header__filter-icon')
const filterOptionsEl = document.querySelector('.l-header__filter-options')
const addTaskInputEl = document.querySelector('.c-add-task__input')
const addTaskInputButtonEl = document.querySelector('.c-add-task__button')
const taskListEl = document.querySelector('.c-task__list')
const addTaskModalButtonEl = document.querySelector('.c-add-task-button')
const addTaskModalEl = document.querySelector('.c-add-task-modal')
const addTaskModalTextAreaEl = document.querySelector('.c-add-task-modal__text-area')
const addTaskModalCancelButtonEl = document.querySelector('[data-js="cancel"]')
const addTaskModalSaveButtonEl = document.querySelector('[data-js="save"]')

const tasks = []

const activeFilterOptions = () => {
    const condition = !filterOptionsEl.classList.contains('is-active')
    if (condition) {
        filterOptionsEl.classList.add('is-opened')
        filterOptionsEl.classList.add('is-active')
        return
    }
    filterOptionsEl.classList.remove('is-opened')
    filterOptionsEl.classList.add('is-closed')
    const interval = setTimeout(() => {
        filterOptionsEl.classList.remove('is-closed')
        filterOptionsEl.classList.remove('is-active')
    }, 1000)
}

const isLocalStorageEmpty = () => {
    const localStorageCondition = localStorage.tasks !== undefined && localStorage.tasks !== null && localStorage.tasks !== ''
    if (localStorageCondition) {
        return false
    }
    return true
}

const updateLocalStorage = () => {
    localStorage.removeItem('tasks')
    if (tasks.length > 0) {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }
}

const clearAddTaskInput = () => {
    addTaskInputEl.value = ''
    addTaskInputEl.focus()
}

const removeTask = event => {
    const targetID = Number(event.target.dataset.id)
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === targetID) {
            tasks.splice(i, 1)
            updateLocalStorage()
            renderTasks()
        }
    }
}

const finalizeTask = event => {
    const targetID = Number(event.target.dataset.id)
    for (let i = 0; i < tasks.length; i++) {
        if(tasks[i].id === targetID) {
            if (tasks[i].isFinished) {
                tasks[i].isFinished = false
            } else {
                tasks[i].isFinished = true
            }
            updateLocalStorage()
            renderTasks()
        }
    }
}

const createTaskElement = ({id, isFinished, content}) => {
    const isFinishedClass = isFinished ? ' is-finished' : ''
   
    const taskItem = document.createElement('li')
    taskItem.classList.add('c-task__item')
    taskItem.dataset.id = id
    
    const taskCheck = document.createElement('div')
    taskCheck.setAttribute('class', `c-task__check${isFinishedClass}`)
    taskCheck.dataset.id = id
    taskCheck.addEventListener('click', finalizeTask)
   
    const taskCheckIcon = document.createElement('img')
    taskCheckIcon.setAttribute('class', `c-task__check-icon${isFinishedClass}`)
    taskCheckIcon.dataset.id = id
    taskCheckIcon.src = 'img/check.svg'
  
    const taskMessageContainer = document.createElement('div')
    taskMessageContainer.classList.add('c-task__message-container')
    taskMessageContainer.dataset.id = id
    
    const taskMessage = document.createElement('p')
    taskMessage.setAttribute('class', `c-task__message${isFinishedClass}`)
    taskMessage.textContent = content
   
    const taskCloseButton = document.createElement('div')
    taskCloseButton.classList.add('c-task__close-button')
    taskCloseButton.dataset.id = id
    taskCloseButton.addEventListener('click', removeTask)
    
    taskCheck.appendChild(taskCheckIcon)
    taskMessageContainer.appendChild(taskMessage)
    taskItem.appendChild(taskCheck)
    taskItem.appendChild(taskMessageContainer)
    taskItem.appendChild(taskCloseButton)

    return taskItem
}

const clearTasksArray = () => {
    while (tasks.length > 0) {
        tasks.pop()
    }
}

const getTasks = () => {
    if (!isLocalStorageEmpty()) {
        clearTasksArray()
        const localStorageTasks = JSON.parse(localStorage.tasks)
        localStorageTasks.forEach(task => {
            tasks.push(task)
        })
    }
}

const renderTasks = () => {
    taskListEl.innerHTML = ''
    if (tasks.length !== 0 && !isLocalStorageEmpty()) {
        getTasks()
        tasks.forEach(task => {
            taskListEl.appendChild(createTaskElement(task))
        })
    }
}

const addTask = task => {
    let currentTask = {
        id: (isLocalStorageEmpty() ? 1 : tasks[tasks.length - 1].id + 1),
        content: task,
        isFinished: false
    }
    tasks.push(currentTask)
    updateLocalStorage()
    clearAddTaskInput()
    renderTasks()
}

const updateTask = (newTask, id) => {
    const taskID = Number(id)
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskID) {
            tasks[i].content = newTask
        }
    }
}

const closeTaskModal = () => {
    addTaskModalTextAreaEl.textContent = ''
    addTaskModalEl.classList.remove('is-active')
}

const showTaskModal = (action = 'new', message = '', id = 0) => {
    addTaskModalEl.classList.add('is-active')
    if (action === 'new') {
        addTaskModalSaveButtonEl.addEventListener('click', () => {
            if (addTaskModalTextAreaEl.textContent !== '') {
                addTask(addTaskModalTextAreaEl.textContent)
                closeTaskModal()
            }
        })
    }
}

filterButtonEl.addEventListener('click', activeFilterOptions)

addTaskInputButtonEl.addEventListener('click', () => {
    if (addTaskInputEl.value !== '') {
        addTask(addTaskInputEl.value)
    }
})

document.addEventListener('keypress', event => {
    if(event.key === 'Enter' && addTaskInputEl.value !== '') {
        addTask(addTaskInputEl.value)
    } 
})

addTaskModalButtonEl.addEventListener('click', showTaskModal)

addTaskModalCancelButtonEl.addEventListener('click', closeTaskModal)

addTaskModalSaveButtonEl.addEventListener('click', () => {
    if (addTaskModalTextAreaEl.value !== '') {
        addTask(addTaskModalTextAreaEl.value)
        closeTaskModal()
    }
})

window.addEventListener('load', () => {
    getTasks()
    renderTasks()
})