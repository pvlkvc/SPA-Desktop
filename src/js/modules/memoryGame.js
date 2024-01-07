import { AppWindow } from './appWindow'
import * as dragAndDrop from './dragAndDrop.js'

export class MemoryGame extends AppWindow {
  #images
  #width = 4
  #height = 4

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

    this.#getGameImages(this.#width * this.#height)

    const gameboard = this.#getGameboard()
    gameWindow.appendChild(gameboard)

    document.getElementById('desktop').appendChild(gameWindow)
  }

  /**
   * Shuffles the image ids for the game.
   * @param { number } images number of images in the game
   */
  #getGameImages (images) {
    const array = []

    for (let i = 0; i < images / 2; i++) {
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

  /**
   * Creates and returns a gameboard for the upcoming game.
   * @returns { HTMLElement } gameboard populated with cards
   */
  #getGameboard () {
    const gameboard = document.createElement('div')
    let index = 0

    for (let i = 0; i < this.#height; i++) {
      const row = document.createElement('div')
      row.classList.add('memory-row')
      gameboard.appendChild(row)
      for (let j = 0; j < this.#width; j++) {
        const card = document.createElement('div')
        card.classList.add('memory-card')

        const image = document.createElement('img')
        image.classList.add('memory-card-image')
        image.setAttribute('src', './img/pet-' + this.#images[index] + '.png')
        card.appendChild(image)

        row.appendChild(card)
        index++
      }
    }

    return gameboard
  }
}
