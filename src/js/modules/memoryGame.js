import { AppWindow } from './AppWindow'

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

    this.#launchApp()
    this.#setupMemoryListeners()
  }

  disconnectedCallback () {
    console.log('memory game removed.')
  }

  #launchApp () {
    const menu = document.createElement('div')
    menu.classList.add('memory-game-menu')
    menu.setAttribute('id', 'memoryMenu')

    const text = document.createElement('p')
    text.textContent = 'Press a button to start a new game'
    menu.appendChild(text)

    // buttons container
    const buttonRow = document.createElement('div')
    buttonRow.classList.add('row')
    menu.appendChild(buttonRow)

    // creating the buttons
    const dimA = document.createElement('input')
    dimA.classList.add('app-window-button')
    dimA.setAttribute('type', 'submit')
    const dimB = dimA.cloneNode(true)
    const dimC = dimA.cloneNode(true)

    // assigning names to buttons
    dimA.setAttribute('value', '2x2')
    dimB.setAttribute('value', '2x4')
    dimC.setAttribute('value', '4x4')

    // buttons listeners
    dimA.addEventListener('click', () => {
      menu.remove()
      this.#launchGame()
    })
    dimB.addEventListener('click', () => {
      menu.remove()
      this.#launchGame()
    })
    dimC.addEventListener('click', () => {
      menu.remove()
      this.#launchGame()
    })

    // adding buttons to the website
    buttonRow.appendChild(dimA)
    buttonRow.appendChild(dimB)
    buttonRow.appendChild(dimC)

    this.appBox.appendChild(menu)
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

  #launchGame () {
    const gameWindow = document.createElement('div')
    gameWindow.setAttribute('id', 'memoryGame')
    gameWindow.classList.add('memory-game-window')

    this.#getGameImages(this.#width * this.#height)
    this.#getGameboard()
    gameWindow.appendChild(this.#gameboard)

    // controls info
    const cBox = document.createElement('div')
    cBox.classList.add('controls-box')
    const cText = document.createElement('p')
    cText.textContent = 'ADD CONTROLS HERE ONCE I ACTUALLY DECIDE AND IMPLEMENT THEM'
    cBox.appendChild(cText)
    gameWindow.appendChild(cBox)

    // restart button
    const restartButton = document.createElement('input')
    restartButton.classList.add('app-window-button')
    restartButton.setAttribute('type', 'submit')
    restartButton.setAttribute('value', 'New Game')
    restartButton.setAttribute('id', 'memoryRestart')
    restartButton.addEventListener('click', () => {
      this.appBox.removeChild(gameWindow)
      this.#launchGame()
    })
    gameWindow.appendChild(restartButton)

    this.appBox.appendChild(gameWindow)
  }

  #setupMemoryListeners () {
    document.addEventListener('keypress', function (event) {
        const memoryGame = document.getElementById('memoryGame')
        const memoryMenu = document.getElementById('memoryMenu')

        if (memoryMenu != null) {
            console.log('memory menu keyboard press')
        }
        if (memoryGame != null) {
          if (event.key === 'r' || event.key === 'R') {
            event.preventDefault()
            document.getElementById('memoryRestart').click()
          }
            console.log('memory game keyboard press')
        }
    })
}
}
