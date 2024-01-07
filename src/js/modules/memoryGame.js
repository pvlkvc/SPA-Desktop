import { AppWindow } from './appWindow'
import * as dragAndDrop from './dragAndDrop.js'

export class MemoryGame extends AppWindow {
  #images

  constructor () {
    super()
    console.log('memory game constructor')
  }

  connectedCallback () {
    console.log('memory game added.')

    this.launchApp()
  }

  disconnectedCallback () {
    console.log('custom element removed from page.')
  }

  launchApp () {
    const gameWindow = document.createElement('div')
    gameWindow.classList.add('app-window')
    dragAndDrop.makeDraggable(gameWindow)

    document.getElementById('desktop').appendChild(gameWindow)
  }

  #getGameImages (pairs) {
    const array = []

    for (let i = 0; i > pairs; i++) {
      array[2 * i] = i + 1
      array[2 * i + 1] = i + 1
    }

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }

    this.#images = array
  }
}
