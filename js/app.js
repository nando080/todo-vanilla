const filterButtonEl = document.querySelector('.l-header__filter-icon')
const filterOptionsContainerEl = document.querySelector('.l-header__filter-options')
const filterOptionsEl = document.querySelectorAll('.l-header__filter-item')
const addTaskInputEl = document.querySelector('.c-add-task__input')
const addTaskInputButtonEl = document.querySelector('.c-add-task__button')
const taskListEl = document.querySelector('.c-task__list')
const addTaskModalButtonEl = document.querySelector('.c-add-task-button')

const tasks = []

const activeFilterOptions = () => {
    const condition = !filterOptionsContainerEl.classList.contains('is-active')
    if (condition) {
        filterOptionsContainerEl.classList.add('is-opened')
        filterOptionsContainerEl.classList.add('is-active')
        return
    }
    filterOptionsContainerEl.classList.remove('is-opened')
    filterOptionsContainerEl.classList.add('is-closed')
    const interval = setTimeout(() => {
        filterOptionsContainerEl.classList.remove('is-closed')
        filterOptionsContainerEl.classList.remove('is-active')
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
        if (tasks[i].id === targetID) {
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
    tasks.forEach((task, index) => {
        if (task.id === id) {
            tasks[index].content = newTask
            updateLocalStorage()
            renderTasks()
            return
        }
    })
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

const renderFilteredTasks = filter => {
    if (!isLocalStorageEmpty()) {
        taskListEl.innerHTML = ''
        getTasks()
        const filteredTasks = tasks.filter(task => {
            if (filter === 'finished') {
                return task.isFinished
            }
            if (filter === 'unfinished') {
                return !task.isFinished
            }
        })
        filteredTasks.forEach(task => {
            taskListEl.appendChild(createTaskElement(task))
        })
    }
}

const createTaskElement = ({ id, isFinished, content }) => {
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
    taskMessageContainer.addEventListener('click', event => {
        const currentID = Number(taskMessageContainer.dataset.id)
        const currentTask = event.target.textContent
        showTaskModal('update', currentTask, currentID)
    })

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

const closeTaskModal = () => {
    const body = document.querySelector('body')
    const taskModal = document.querySelector('.c-add-task-modal')
    const taskModalContainer = document.querySelector('.c-add-task-modal__container')
    console.log(body, taskModal, taskModalContainer)
    taskModalContainer.classList.add('hide')
    taskModal.classList.add('hide')
    const interval = setTimeout(() => {
        taskModal.remove()
        body.classList.remove('is-blocked')
    }, 900)
    clearAddTaskInput()
    return
}

const modalSaveHandle = (action, taskContent, currentID) => {
    if (action === 'new' && taskContent !== '') {
        addTask(taskContent)
        closeTaskModal()
    }
    if (action === 'update' && taskContent !== '' && currentID > 0) {
        updateTask(taskContent, currentID)
    }
    updateLocalStorage()
    renderTasks()
    closeTaskModal()
    return
}

const createAddTaskModal = (action, updateContent, currentID) => {

    const addTaskModal = document.createElement('div')
    addTaskModal.setAttribute('class', 'c-add-task-modal show')

    const addTaskModalContainer = document.createElement('div')
    addTaskModalContainer.setAttribute('class', 'c-add-task-modal__container show')

    const addTaskModalTitle = document.createElement('h2')
    addTaskModalTitle.classList.add('c-add-task-modal__title')
    addTaskModalTitle.textContent = 'tarefa'

    const addTaskModalTextArea = document.createElement('textarea')
    addTaskModalTextArea.classList.add('c-add-task-modal__text-area')
    addTaskModalTextArea.cols = "30"
    addTaskModalTextArea.rows = "10"
    addTaskModalTextArea.placeholder = "Escreva uma tarefa..."
    addTaskModalTextArea.autofocus
    if (action === 'update') {
        addTaskModalTextArea.textContent = updateContent
    }

    const addTaskModalButtonContainer = document.createElement('div')
    addTaskModalButtonContainer.classList.add('c-add-task-modal__button-container')

    const addTaskModalCancelButton = document.createElement('button')
    addTaskModalCancelButton.classList.add('c-add-task-modal__button')
    addTaskModalCancelButton.textContent = 'cancelar'
    addTaskModalCancelButton.addEventListener('click', closeTaskModal)

    const addTaskModalSaveButton = document.createElement('button')
    addTaskModalSaveButton.setAttribute('class', 'c-add-task-modal__button c-add-task-modal__button--primary')
    addTaskModalSaveButton.textContent = 'salvar'
    addTaskModalSaveButton.addEventListener('click', () => {
        const currentContent = addTaskModalTextArea.value
        modalSaveHandle(action, currentContent, currentID)
    })

    addTaskModalButtonContainer.appendChild(addTaskModalCancelButton)
    addTaskModalButtonContainer.appendChild(addTaskModalSaveButton)

    addTaskModalContainer.appendChild(addTaskModalTitle)
    addTaskModalContainer.appendChild(addTaskModalTextArea)
    addTaskModalContainer.appendChild(addTaskModalButtonContainer)

    addTaskModal.appendChild(addTaskModalContainer)

    return addTaskModal
}

const showTaskModal = (currentAction = 'new', currentContent = '', currentID = 0) => {
    const body = document.querySelector('body')
    const newModal = createAddTaskModal(currentAction, currentContent, currentID)
    body.appendChild(newModal)
    body.classList.add('is-blocked')
    const interval = setTimeout(() => {
        document.querySelector('.c-add-task-modal__container').classList.remove('show')
        document.querySelector('.c-add-task-modal').classList.remove('show')
    }, 1000)
}

const clearActiveFilterButtons = () => {
    filterOptionsEl.forEach(button => {
        button.classList.remove('is-active')
    })
}

filterButtonEl.addEventListener('click', activeFilterOptions)

addTaskInputButtonEl.addEventListener('click', () => {
    if (addTaskInputEl.value !== '') {
        addTask(addTaskInputEl.value)
    }
})

document.addEventListener('keypress', event => {
    if (event.key === 'Enter' && addTaskInputEl.value !== '') {
        addTask(addTaskInputEl.value)
    }
})

addTaskModalButtonEl.addEventListener('click', () => {
    showTaskModal()
})


filterOptionsEl.forEach(button => {
    button.addEventListener('click', event => {
        const optionType = event.target.dataset.js
        const isFilterActive = event.target.classList.contains('is-active')
        if (isFilterActive) {
            clearActiveFilterButtons()
            renderTasks()
            activeFilterOptions()
            return
        }
        clearActiveFilterButtons()
        event.target.classList.add('is-active')
        renderFilteredTasks(optionType)
        activeFilterOptions()
    })
})

window.addEventListener('load', () => {
    getTasks()
    renderTasks()
})