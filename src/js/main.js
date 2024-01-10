import * as dap from './modules/dragAndDrop.js'
import * as MemoryGame from './modules/memoryGame.js'
import * as Chat from './modules/chat.js'

// custom elements
window.customElements.define('memory-game', MemoryGame.MemoryGame)
window.customElements.define('chat-app', Chat.Chat)

// constants
const desktop = document.getElementById('desktop')
const memoryGameButton = document.getElementById('buttonA')
const chatButton = document.getElementById('buttonB')


// prepare desktop as a dropzone
dap.makeDropZone(desktop)

// buttons listeners
memoryGameButton.addEventListener('click', () => {
  console.log('memory button clicked')

  const memory = document.createElement('memory-game')
  desktop.appendChild(memory)
})

chatButton.addEventListener('click', () => {
  console.log('chat button clicked')

  const chat = document.createElement('chat-app')
  desktop.appendChild(chat)
})
