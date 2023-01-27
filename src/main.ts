import './style.css'

const button = document.createElement('button')
button.type = 'button'
button.textContent = `Clear`

button.addEventListener('click', async () => {
  const response = chrome.runtime.sendMessage({ clear: true })
  console.log(response)
})

document.querySelector<HTMLDivElement>('#app')!.appendChild(button)
