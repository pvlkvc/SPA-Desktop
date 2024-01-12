import * as memoryGame from './modules/MemoryGame.js'
import * as chat from './modules/Chat.js'
import * as snake from './modules/SnakeGame.js'
import * as desktop from './modules/Desktop.js'

// custom elements
window.customElements.define('memory-game', memoryGame.MemoryGame)
window.customElements.define('chat-app', chat.Chat)
window.customElements.define('snake-game', snake.SnakeGame)
window.customElements.define('pwd-desktop', desktop.Desktop)

const desktopEl = document.createElement('pwd-desktop')
desktopEl.setAttribute('id', 'pwd-desktop')
document.getElementById('body').appendChild(desktopEl)
