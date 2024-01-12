import { AppWindow } from './AppWindow'

export class MemoryGame extends AppWindow {
  #images
  gameStarted = false
  #firstFlip
  #flippedCards
  #width = 4
  #height = 4
  gameboard
  selectedTileIndex
  selectedTile
  #tileElements = []

  constructor () {
    super()
    console.log('memory game constructor')
  }

  connectedCallback () {
    console.log('memory game added.')

    this.setTitle('Memory game')
    this.#createMenu()
    this.#setupKeyboardListeners()
  }

  disconnectedCallback () {
    console.log('memory game removed.')
  }

  /**
   * Creates the main menu.
   */
  #createMenu () {
    const menu = document.createElement('div')
    menu.classList.add('memory-game-menu')

    const text = document.createElement('p')
    text.textContent = 'Press a button to start a new game'
    menu.appendChild(text)

    // buttons container
    const buttonRow = document.createElement('div')
    buttonRow.classList.add('column', 'memory-menu-button-box')
    menu.appendChild(buttonRow)

    // creating the buttons
    const dimA = document.createElement('input')
    dimA.classList.add('memory-menu-button')
    dimA.setAttribute('type', 'submit')
    const dimB = dimA.cloneNode(true)
    const dimC = dimA.cloneNode(true)

    // assigning names to buttons
    dimA.setAttribute('value', '2x2')
    dimB.setAttribute('value', '2x4')
    dimC.setAttribute('value', '4x4')

    // buttons listeners
    dimA.addEventListener('click', () => { this.#gameStart(2, 2) })
    dimB.addEventListener('click', () => { this.#gameStart(2, 4) })
    dimC.addEventListener('click', () => { this.#gameStart(4, 4) })

    // adding buttons to the website
    buttonRow.appendChild(dimA)
    buttonRow.appendChild(dimB)
    buttonRow.appendChild(dimC)

    this.appBox.appendChild(menu)
  }

  /**
   * Advances from the menu to the game.
   */
  #gameStart (w, h) {
    this.gameStarted = true
    this.#width = w
    this.#height = h
    this.#flippedCards = Array(w * h)
    for (let i = 0; i < w * h; i++) {
      this.#flippedCards[i] = false
    }
    console.log(this.#flippedCards)
    this.appBox.removeChild(this.appBox.lastChild)
    this.#createGame()
  }

  /**
   * Creates the game element.
   */
  #createGame () {
    const gameWindow = document.createElement('div')
    gameWindow.setAttribute('id', 'memoryGame')
    gameWindow.classList.add('memory-game-window')

    // the actual game
    this.#shuffleGameImages(this.#width * this.#height)
    this.#createGameboard()
    gameWindow.appendChild(this.gameboard)

    // controls info
    const cBox = document.createElement('div')
    cBox.classList.add('controls-box')
    const cText = document.createElement('p')
    const controls = "R - new game\n↑ - up\n↓ - down\n← - left\n→ - right"
    cText.textContent = controls
    cBox.appendChild(cText)
    gameWindow.appendChild(cBox)

    // restart button
    const restartButton = document.createElement('input')
    restartButton.classList.add('memory-game-restart-button')
    restartButton.setAttribute('type', 'submit')
    restartButton.setAttribute('value', 'New Game')
    restartButton.setAttribute('id', 'memoryRestart')
    restartButton.addEventListener('click', () => {
      this.appBox.removeChild(gameWindow)
      this.#createGame()
    })
    gameWindow.appendChild(restartButton)

    // placing this all inside the app window
    this.appBox.appendChild(gameWindow)
  }

  /**
   * Shuffles the image ids for the game.
   * @param { number } images number of images in the game
   */
  #shuffleGameImages (images) {
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
  #createGameboard () {
    this.gameboard = document.createElement('div')
    this.gameboard.classList.add('gameboard')
    let index = 0

    for (let i = 0; i < this.#height; i++) {
      const row = document.createElement('div')
      row.classList.add('memory-row')
      this.gameboard.appendChild(row)
      for (let j = 0; j < this.#width; j++) {
        const card = document.createElement('div')
        card.classList.add('memory-card', 'memory-card-active')
        card.setAttribute('card-index', index)
        card.setAttribute('image-id', this.#images[index])

        const image = document.createElement('img')
        image.classList.add('memory-card-image', 'invisible')
        image.setAttribute('src', './img/pet-' + this.#images[index] + '.png')
        image.setAttribute('draggable', 'false')
        card.appendChild(image)

        card.addEventListener('click', () => {
          this.#handleCardFlip(card)
        })

        // keep an array of elements corresponding to cards for easier access
        this.#tileElements.push(card)

        row.appendChild(card)
        index++
      }
    }

    this.#selectTile(0)
  }

  /**
   * Decides the outcome after flipping a card.
   * @param { HTMLElement } flipped recently flipped card
   * @returns true if two flipped cards match
   */
  #handleCardFlip (flipped) {
    const flippedImage = flipped.lastChild

    flippedImage.classList.remove('invisible')
    flippedImage.classList.add('visible')

    if (!this.#firstFlip) {
      console.log('this is first flip')
      this.#firstFlip = flipped
      // return
    } else {
      if (this.#firstFlip === flipped) return

      const id1 = this.#firstFlip.getAttribute('image-id')
      const id2 = flipped.getAttribute('image-id')

      this.gameboard.classList.add('unclickable')

      if (id1 !== id2) {
        setTimeout(() => {
          this.#firstFlip.lastChild.classList.add('invisible')
          flippedImage.classList.add('invisible')
          this.#firstFlip.lastChild.classList.remove('visible')
          flippedImage.classList.remove('visible')

          this.#firstFlip = null
          this.gameboard.classList.remove('unclickable')
        }, 1500)
      } else {
        this.#flippedCards[flipped.getAttribute('card-index')] = true
        this.#flippedCards[this.#firstFlip.getAttribute('card-index')] = true
        this.#firstFlip.classList.remove('memory-card-active')
        flipped.classList.remove('memory-card-active')
        this.#firstFlip = null
        this.gameboard.classList.remove('unclickable')
        if (this.#isVictory()) {
          this.#presentVictory()
        }
        console.log(this.#flippedCards)
      }
    }
  }

  /**
   * Creates the keyboard event listeners.
   */
  #setupKeyboardListeners () {
    this.addEventListener('keypress', function (event) {
        if (!this.gameStarted) {
            console.log('memory menu keyboard press')
            // todo this
        } else {
          if (event.key == 'r' || event.key == 'R') {
            event.preventDefault()
            document.getElementById('memoryRestart').click()
          } else if (event.key == 'Enter' || event.key == ' ') {
            if (!this.gameboard.classList.contains('unclickable')) {
              this.selectedTile.click()
            }
          }
        }
    })
    this.addEventListener('keydown', function (event) {
      if (this.gameStarted) {
        if (event.key == 'ArrowRight') {
          this.selectRight()
        } else if (event.key == 'ArrowUp') {
          this.selectUp()
        } else if (event.key == 'ArrowLeft') {
          this.selectLeft()
        } else if (event.key == 'ArrowDown') {
          this.selectDown()
        }
      }
  })
  }

  #selectTile (arrayIndex) {
    if (this.selectedTile) {
      this.selectedTile.classList.remove('memory-card-selected')
    }
    this.selectedTile = this.#tileElements[arrayIndex]
    this.selectedTileIndex = arrayIndex

    this.selectedTile.classList.add('memory-card-selected')
  }

  selectDown () {
    if (this.selectedTileIndex + this.#width < this.#width * this.#height) {
      this.#selectTile(this.selectedTileIndex + this.#width)
    }
  }

  selectUp () {
    if (this.selectedTileIndex - this.#width >= 0) {
      this.#selectTile(this.selectedTileIndex - this.#width)
    }
  }

  selectLeft () {
    if (this.selectedTileIndex > (~~(this.selectedTileIndex / this.#width)) * this.#width) {
      this.#selectTile(this.selectedTileIndex - 1)
    }
  }

  selectRight () {
    if (this.selectedTileIndex + 1 < (~~(this.selectedTileIndex / this.#width) + 1) * this.#width) {
      this.#selectTile(this.selectedTileIndex + 1)
    }
  }

  #isVictory () {
    for (let i = 0; i < this.#width * this.#height; i++) {
      if (!this.#flippedCards[i]) {
        return false
      }
    }
    return true
  }

  #presentVictory() {
    const victoryMessage = document.createElement('h1')
    victoryMessage.textContent = 'Victory'
    victoryMessage.classList.add('memory-game-victory-message')

    this.gameboard.appendChild(victoryMessage)
  }
}
