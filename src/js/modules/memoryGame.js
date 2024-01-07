import { AppWindow } from './appWindow'
import * as dragAndDrop from './dragAndDrop.js'

export class MemoryGame extends AppWindow {
  images = ['./img/pet-1.png', './img/pet-2.png', './img/pet-3.png', './img/pet-4.png',
    './img/pet-5.png', './img/pet-6.png', './img/pet-7.png', './img/pet-8.png']

  constructor () {
    super()
    console.log('memory game constructor')
  }

  connectedCallback () {
    console.log('memory game added.')

    this.launchApp()

    // const text = document.createElement('')
    // text.textContent = 'wassup'

    // document.getElementById('maine').appendChild(text)
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
}
