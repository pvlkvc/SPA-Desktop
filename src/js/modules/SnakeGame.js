import { AppWindow } from './AppWindow.js'

export class SnakeGame extends AppWindow {
  Directions = {
    Up: 0,
    Right: 1,
    Down: 2,
    Left: 3
  }

  snakeGame
  width = 20
  height = 20
  snakeLength
  currentDirection
  gameboard
  foodPos
  interval

  connectedCallback () {
    this.setTitle('Snake')
    this.#setupKeyboardListeners()

    this.buildApp()
    this.playGame()
  }

  disconnectedCallback () {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  /**
   * Creates the HTML elements for the program.
   */
  buildApp () {
    this.snakeGame = document.createElement('div')
    this.snakeGame.classList.add('column', 'snake-game')

    this.appBox.appendChild(this.snakeGame)
  }

  /**
   * Creates HTML elements that are to be created after the game is started.
   */
  buildGameUI () {
    // controls info
    const cBox = document.createElement('div')
    cBox.classList.add('controls-box')
    const cText = document.createElement('p')
    const controls = 'R - new game\n↑ - up\n↓ - down\n← - left\n→ - right'
    cText.textContent = controls
    cBox.appendChild(cText)
    this.snakeGame.appendChild(cBox)

    // restart button
    const restartButton = document.createElement('input')
    restartButton.classList.add('memory-game-restart-button')
    restartButton.setAttribute('type', 'submit')
    restartButton.setAttribute('value', 'New Game')
    restartButton.addEventListener('click', () => {
      this.restartGame()
    })
    this.snakeGame.appendChild(restartButton)
  }

  /**
   * Resets the game variables and starts the game.
   */
  playGame () {
    this.snakeLength = 2
    this.currentDirection = this.Directions.Right
    this.gameState = []
    this.gameState.push({ x: this.width / 2, y: this.height / 2 })

    this.createBoard()
    this.spawnFood()

    this.buildGameUI()

    this.interval = setInterval(() => this.updateGame(), 350)
  }

  /**
   * Updates the game status.
   * Meant to be used regularly, so that the game can look fluent.
   */
  updateGame () {
    const lastState = this.gameState[this.gameState.length - 1]
    const sx = lastState.x
    const sy = lastState.y

    // loss check (is the current position invalid)
    if (this.hasLost()) {
      this.showGameoverMessage()
      clearInterval(this.interval)
      return
    }

    // food check
    if (this.foodPos.x === lastState.x && this.foodPos.y === lastState.y) {
      this.snakeLength++
      this.spawnFood()
    }

    this.updateBoard()

    // advance
    if (this.currentDirection === this.Directions.Up) {
      this.gameState.push({ x: sx, y: sy - 1 })
    } else if (this.currentDirection === this.Directions.Right) {
      this.gameState.push({ x: sx + 1, y: sy })
    } else if (this.currentDirection === this.Directions.Down) {
      this.gameState.push({ x: sx, y: sy + 1 })
    } else if (this.currentDirection === this.Directions.Left) {
      this.gameState.push({ x: sx - 1, y: sy })
    }

    // cleanup of too old states
    for (let i = 0; i < this.gameState.length - this.snakeLength; i++) {
      this.gameState.shift()
    }
  }

  /**
   * Creates the HTML element that will be used as the gameboard.
   */
  createBoard () {
    this.gameboard = document.createElement('table')
    this.gameboard.classList.add('snake-board-table')

    for (let i = 0; i < this.height; i++) {
      const tr = document.createElement('tr')
      for (let j = 0; j < this.height; j++) {
        const td = document.createElement('td')
        td.classList.add('snake-board-td')
        tr.appendChild(td)
      }

      this.gameboard.appendChild(tr)
    }

    this.snakeGame.appendChild(this.gameboard)
  }

  /**
   * Updates the board so that it matches the current game status.
   */
  updateBoard () {
    // fill all with blue
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const td = this.gameboard.rows[i].cells[j]
        td.classList.remove('snake-board-snake-cell')
        td.classList.remove('snake-board-food-cell')
      }
    }

    for (let i = 0; i < this.gameState.length; i++) {
      const sx = this.gameState[i].x
      const sy = this.gameState[i].y

      this.gameboard.rows[sy].cells[sx].classList.add('snake-board-snake-cell')
    }

    const fx = this.foodPos.x
    const fy = this.foodPos.y
    this.gameboard.rows[fy].cells[fx].classList.add('snake-board-food-cell')
  }

  /**
   * Creates the keyboard event listeners for this class.
   */
  #setupKeyboardListeners () {
    this.addEventListener('keypress', function (event) {
      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault()
        this.restartGame()
      }
    })
    this.addEventListener('keydown', function (event) {
      if (this.gameStarted) {
        if (event.key === 'ArrowRight') {
          this.goRight()
        } else if (event.key === 'ArrowUp') {
          this.goUp()
        } else if (event.key === 'ArrowLeft') {
          this.goLeft()
        } else if (event.key === 'ArrowDown') {
          this.goDown()
        }
      }
    })
  }

  /**
   * Selects a location for food to appear in.
   */
  spawnFood () {
    let invalidPos = true
    let fx = 0
    let fy = 0

    while (invalidPos) {
      invalidPos = false
      fx = Math.floor(Math.random() * (this.width))
      fy = Math.floor(Math.random() * (this.height))

      for (let i = 0; i < this.gameState.length; i++) {
        const sx = this.gameState[i].x
        const sy = this.gameState[i].y

        if (sx === fx && sy === fy) {
          invalidPos = true
          break
        }
      }
    }

    this.foodPos = { x: fx, y: fy }
  }

  /**
   * Updates the game status on the spot instead of waiting for the interval.
   */
  dynamicallyUpdate () {
    this.updateGame()
    clearInterval(this.interval)
    this.interval = setInterval(() => this.updateGame(), 350)
  }

  /**
   * Sets the snake's direction as UP.
   */
  goUp () {
    if (this.currentDirection !== this.Directions.Down &&
            this.currentDirection !== this.Directions.Up) {
      this.currentDirection = this.Directions.Up
      this.dynamicallyUpdate()
    }
  }

  /**
   * Sets the snake's direction as RIGHT.
   */
  goRight () {
    if (this.currentDirection !== this.Directions.Left &&
            this.currentDirection !== this.Directions.Right) {
      this.currentDirection = this.Directions.Right
      this.dynamicallyUpdate()
    }
  }

  /**
   * Sets the snake's direction as DOWN.
   */
  goDown () {
    if (this.currentDirection !== this.Directions.Up &&
            this.currentDirection !== this.Directions.Down) {
      this.currentDirection = this.Directions.Down
      this.dynamicallyUpdate()
    }
  }

  /**
   * Sets the snake's direction as LEFT.
   */
  goLeft () {
    if (this.currentDirection !== this.Directions.Right &&
            this.currentDirection !== this.Directions.Left) {
      this.currentDirection = this.Directions.Left
      this.dynamicallyUpdate()
    }
  }

  /**
   * Checks if the player has lost.
   * @returns { boolean } true if gameover condition occured
   */
  hasLost () {
    const sx = this.gameState[this.gameState.length - 1].x
    const sy = this.gameState[this.gameState.length - 1].y

    if (sx >= this.width || sx < 0 || sy >= this.height || sy < 0) {
      return true
    }
    for (let i = 0; i < this.gameState.length - 1; i++) {
      const px = this.gameState[i].x
      const py = this.gameState[i].y

      if (px === sx && py === sy) {
        return true
      }
    }

    return false
  }

  /**
   * Presents the gameover message.
   */
  showGameoverMessage () {
    const message = document.createElement('h1')
    message.textContent = 'Gameover'
    message.classList.add('snake-gameover-message')

    this.gameboard.appendChild(message)
  }

  /**
   * Restarts the entire game.
   */
  restartGame () {
    this.snakeGame.remove()
    clearInterval(this.interval)
    this.buildApp()
    this.playGame()
  }
}
