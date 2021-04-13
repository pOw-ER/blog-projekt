let bar = document.querySelector('.fa-bars')
let hamburger = document.querySelector('#hamburger')
let close = document.querySelector('.fa-times')

bar.addEventListener('click', () => {
  hamburger.classList.add('menü')
})
close.addEventListener('click', () => {
  hamburger.classList.remove('menü')
})
