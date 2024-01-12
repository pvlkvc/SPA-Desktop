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
    snakeLength = 1
    currentDirection
    gameState = []
    gameboard
    foodPos
    interval

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
        this.spawnFood()

        this.interval = setInterval(() => this.updateGame(), 500)
    }

    updateGame () {
        const lastState = this.gameState[this.gameState.length - 1]
        const sx = lastState.x
        const sy = lastState.y

        // loss check (is the current position invalid)
        if (this.hasLost()) {
            this.showGameoverMessage()
            return
        }

        // food check
        if (this.foodPos.x == lastState.x && this.foodPos.y == lastState.y) {
            this.snakeLength++
            this.spawnFood()
        }

        this.updateBoard()

        // advance
        if (this.currentDirection == this.Directions.Up) {
            this.gameState.push( { x: sx, y: sy - 1 } )
        } else if (this.currentDirection == this.Directions.Right) {
            this.gameState.push( { x: sx + 1, y: sy } )
        } else if (this.currentDirection == this.Directions.Down) {
            this.gameState.push( { x: sx, y: sy + 1 } )
        } else if (this.currentDirection == this.Directions.Left) {
            this.gameState.push( { x: sx - 1, y: sy } )
        }

        // cleanup of too old states
        for (let i = 0; i < this.gameState.length - this.snakeLength; i++) {
            this.gameState.shift()
        }
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

            // console.log('updating snake body part ', i)
            // console.log('updating tile at ', sx, sy)

            this.gameboard.rows[sy].cells[sx].classList.add('snake-board-snake-cell')
        }

        const fx = this.foodPos.x
        const fy = this.foodPos.y
        this.gameboard.rows[fy].cells[fx].classList.add('snake-board-food-cell')
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

                if (sx == fx && sy == fy) {
                    invalidPos = true
                    break
                }
            }
        }

        this.foodPos = { x: fx, y: fy }
    }

    dynamicallyUpdate () {
        this.updateGame()
        clearInterval(this.interval)
        this.interval = setInterval(() => this.updateGame(), 500)
    }

    goUp () {
        if (this.currentDirection != this.Directions.Down
            && this.currentDirection != this.Directions.Up) {
            this.currentDirection = this.Directions.Up
            this.dynamicallyUpdate()
        }
    }

    goRight () {
        if (this.currentDirection != this.Directions.Left
            && this.currentDirection != this.Directions.Right) {
            this.currentDirection = this.Directions.Right
            this.dynamicallyUpdate()
        }
    }

    goDown () {
        if (this.currentDirection != this.Directions.Up
            && this.currentDirection != this.Directions.Down) {
            this.currentDirection = this.Directions.Down
            this.dynamicallyUpdate()
        }
    }

    goLeft () {
        if (this.currentDirection != this.Directions.Right
            && this.currentDirection != this.Directions.Left) {
            this.currentDirection = this.Directions.Left
            this.dynamicallyUpdate()
        }
    }

    hasLost () {
        const sx = this.gameState[this.gameState.length - 1].x
        const sy = this.gameState[this.gameState.length - 1].y

        if (sx >= this.width || sx < 0 || sy >= this.height || sy < 0) {
            console.log('LOST DUE TO HITTING WALL')
            return true
        }
        for (let i = 0; i < this.gameState.length - 1; i++) {
            const px = this.gameState[i].x
            const py = this.gameState[i].y

            if (px == sx && py == sy) {
                console.log('LOST DUE TO HITTING TAIL')
                return true
            }
        }
    }

    showGameoverMessage() {
        const message = document.createElement('h1')
        message.textContent = 'Gameover'
        message.classList.add('snake-gameover-message')

        this.gameboard.appendChild(message)
    }
}