import * as dap from './modules/dragAndDrop.js'
import * as MemoryGame from './modules/memoryGame.js'

// custom elements
window.customElements.define('memory-game', MemoryGame.MemoryGame)

// constants
const desktop = document.getElementById('desktop')
const memoryGameButton = document.getElementById('buttonA')

// prepare desktop as a dropzone
dap.makeDropZone(desktop)

// drag test
const testdiv = document.getElementById('testdiv')
dap.makeDraggable(testdiv)

// buttons listeners
memoryGameButton.addEventListener('click', () => {
  console.log('memory button clicked')

  const tempEl = document.createElement('input')
  if (tempEl != null) {
    desktop.appendChild(tempEl)
  }

  // const memory = document.createElement('memory-game')
  // desktop.appendChild(memory)
})
