import * as MemoryGame from './memoryGame.js'

const memoryGameButton = document.getElementById('buttonA')

window.customElements.define('memory-game', MemoryGame.MemoryGame)

memoryGameButton.addEventListener('click', () => {
  console.log('button clicked')
})
