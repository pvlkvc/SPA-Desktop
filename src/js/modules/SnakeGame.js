import { AppWindow } from './AppWindow'

export class SnakeGame extends AppWindow {
    Directions = {
        Up: 0,
        Right: 1,
        Down: 2,
        Left: 3
    }

    gameStarted
    width = 10
    height = 10
    score
    currentDirection
    gameState = []
    gameboard

    constructor () {
        super()
        console.log('snake game constructor')
      }
    
    connectedCallback () {
    console.log('snake game added.')

    this.setTitle('Snake')
    this.#setupKeyboardListeners()

    this.playGame()
    }

    disconnectedCallback () {
    console.log('snake game removed.')
    }

    playGame () {
        this.currentDirection = this.Directions.Right
        this.gameStarted = true
        this.gameState.push( { x: this.width / 2, y: this.height / 2 } )

        this.createBoard()

        setInterval(() => {
            this.updateBoard()

            // advance
            let sx = this.gameState[this.gameState.length - 1].x
            let sy = this.gameState[this.gameState.length - 1].y

            if (this.currentDirection == this.Directions.Up) {
                this.gameState.push( { x: sx, y: sy - 1 } )
            } else if (this.currentDirection == this.Directions.Right) {
                this.gameState.push( { x: sx + 1, y: sy } )
            } else if (this.currentDirection == this.Directions.Down) {
                this.gameState.push( { x: sx, y: sy + 1 } )
            } else if (this.currentDirection == this.Directions.Left) {
                this.gameState.push( { x: sx - 1, y: sy } )
            }
          }, 1000)
    }

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

        console.log(this.gameboard.rows[0].cells)

        this.appBox.appendChild(this.gameboard)
    }

    updateBoard () {
        // fill all with blue

        for (let i = 0; i < this.gameState.length; i++) {
            const sx = this.gameState[i].x
            const sy = this.gameState[i].y

            // console.log('updating snake body part ', i)
            // console.log('updating tile at ', sx, sy)

            this.gameboard.rows[sy].cells[sx].classList.add('snake-board-filled-cell')
        }
    }
    /**
    * Creates the keyboard event listeners.
    */
    #setupKeyboardListeners () {
        this.addEventListener('keypress', function (event) {
            if (!this.gameStarted) {
                console.log('snake menu keyboard press')
                // todo this
            } else {
            if (event.key == 'r' || event.key == 'R') {
                event.preventDefault()
                // todo restart
            }
            }
        })
        this.addEventListener('keydown', function (event) {
            if (this.gameStarted) {
                if (event.key == 'ArrowRight') {
                this.goRight()
                } else if (event.key == 'ArrowUp') {
                this.goUp()
                } else if (event.key == 'ArrowLeft') {
                this.goLeft()
                } else if (event.key == 'ArrowDown') {
                this.goDown()
                }
            }
        })
    }

  goUp () {
    if (this.currentDirection != this.Directions.Down) {
        this.currentDirection = this.Directions.Up
    }
  }

  goRight () {
    if (this.currentDirection != this.Directions.Left) {
        this.currentDirection = this.Directions.Right
    }
  }

  goDown () {
    if (this.currentDirection != this.Directions.Up) {
        this.currentDirection = this.Directions.Down
    }
  }

  goLeft () {
    if (this.currentDirection != this.Directions.Right) {
        this.currentDirection = this.Directions.Left
    }
  }
}