import { AppWindow } from './appWindow'

export class MemoryGame extends AppWindow {
  images = ['./img/pet-1.png', './img/pet-2.png', './img/pet-3.png', './img/pet-4.png',
    './img/pet-5.png', './img/pet-6.png', './img/pet-7.png', './img/pet-8.png']

  constructor () {
    super()
    console.log('Memory game constructor')
  }

  connectedCallback () {
    console.log('Memory game added.')

    this.launchApp()

    // const text = document.createElement('')
    // text.textContent = 'wassup'

    // document.getElementById('maine').appendChild(text)
  }

  disconnectedCallback () {
    console.log('Custom element removed from page.')
  }

  launchApp () {
    const gameWindow = document.createElement('div')
    super.appWindow.appendChild(gameWindow)
  }
}
