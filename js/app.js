const filterButtonEl = document.querySelector('.l-header__filter-icon')
const filterOptionsEl = document.querySelector('.l-header__filter-options')
const addTaskInputEl = document.querySelector('.c-add-task__input')
const addTaskInputButtonEl = document.querySelector('.c-add-task__button')
const taskListEl = document.querySelector('.c-task__list')

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
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

const clearAddTaskInput = () => {
    addTaskInputEl.value = ''
    addTaskInputEl.focus()
}

const createTaskElement = ({id, isFinished, content}) => {
    const isFinishedClass = isFinished ? ' is-finished' : ''
    console.log(id, isFinished, content);
    const taskItem = document.createElement('li')
    taskItem.classList.add('c-task__item')
    taskItem.dataset.id = id
    const taskCheck = document.createElement('div')
    taskCheck.setAttribute('class', `c-task__check${isFinishedClass}`)
    const taskCheckIcon = document.createElement('img')
    taskCheckIcon.setAttribute('class', `c-task__check-icon${isFinishedClass}`)
    taskCheckIcon.src = 'img/check.svg'
    taskCheck.appendChild(taskCheckIcon)
    const taskMessageContainer = document.createElement('div')
    taskMessageContainer.classList.add('c-task__message-container')
    const taskMessage = document.createElement('p')
    taskMessage.setAttribute('class', `c-task__message${isFinishedClass}`)
    taskMessage.textContent = content
    taskMessageContainer.appendChild(taskMessage)
    const taskCloseButton = document.createElement('div')
    taskCloseButton.classList.add('c-task__close-button')
    taskItem.appendChild(taskCheck)
    taskItem.appendChild(taskMessageContainer)
    taskItem.appendChild(taskCloseButton)

    return taskItem
}

const renderTasks = () => {
    if (tasks.length !== 0) {
        taskListEl.innerHTML = ''
        tasks.forEach(task => {
            taskListEl.appendChild(createTaskElement(task))
        })
    }
}

const addTask = task => {
    let currentTask
    console.log(isLocalStorageEmpty())
    if (isLocalStorageEmpty()) {
        currentTask = {
            id: 0,
            content: task,
            isFinished: true
        }
    } else {
        const currentIndex = tasks.length
        currentTask = {
            id: currentIndex,
            content: task,
            isFinished: false
        }
    }
    tasks.push(currentTask)
    updateLocalStorage()
    clearAddTaskInput()
    renderTasks()
}

filterButtonEl.addEventListener('click', activeFilterOptions)

addTaskInputButtonEl.addEventListener('click', () => {
    if (addTaskInputEl.value !== '') {
        addTask(addTaskInputEl.value)
    }
})

console.log(getLocalStorageTasks());