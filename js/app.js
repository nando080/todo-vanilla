const filterButtonEl = document.querySelector('.l-header__filter-icon')
const filterOptionsEl = document.querySelector('.l-header__filter-options')

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

filterButtonEl.addEventListener('click', activeFilterOptions)

console.log(filterOptionsEl);