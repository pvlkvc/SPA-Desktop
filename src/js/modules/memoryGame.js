import { AppWindow } from './appWindow'

export class MemoryGame extends AppWindow {
  #images
  #width = 4
  #height = 4
  #firstFlip
  #gameboard

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

    this.#getGameImages(this.#width * this.#height)
    this.#getGameboard()
    gameWindow.appendChild(this.#gameboard)

    this.appBox.appendChild(gameWindow)
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
   * Creates a gameboard for the upcoming game.
   */
  #getGameboard () {
    this.#gameboard = document.createElement('div')
    this.#gameboard.classList.add('gameboard')
    let index = 0

    for (let i = 0; i < this.#height; i++) {
      const row = document.createElement('div')
      row.classList.add('memory-row')
      this.#gameboard.appendChild(row)
      for (let j = 0; j < this.#width; j++) {
        const card = document.createElement('div')
        card.classList.add('memory-card')

        const image = document.createElement('img')
        image.classList.add('memory-card-image', 'invisible')
        image.setAttribute('src', './img/pet-' + this.#images[index] + '.png')
        image.setAttribute('image-id', this.#images[index])
        card.appendChild(image)

        card.addEventListener('click', () => {
          this.#handleCardFlip(image)
        })

        row.appendChild(card)
        index++
      }
    }
  }

  #handleCardFlip (flipped) {
    flipped.classList.remove('invisible')
    flipped.classList.add('visible')

    if (!this.#firstFlip) {
      console.log('this is first flip')
      this.#firstFlip = flipped
      // return
    } else {
      if (this.#firstFlip === flipped) return

      const id1 = this.#firstFlip.getAttribute('image-id')
      const id2 = flipped.getAttribute('image-id')

      this.#gameboard.classList.add('unclickable')

      if (id1 !== id2) {
        setTimeout(() => {
          this.#firstFlip.classList.add('invisible')
          flipped.classList.add('invisible')
          this.#firstFlip.classList.remove('visible')
          flipped.classList.remove('visible')

          this.#firstFlip = null
          this.#gameboard.classList.remove('unclickable')
        }, 1500)
      } else {
        this.#firstFlip = null
        this.#gameboard.classList.remove('unclickable')
      }
    }
  }
}
