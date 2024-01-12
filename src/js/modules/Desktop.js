import * as dap from './DragAndDrop.js'

export class Desktop extends HTMLElement {
    #desktop
    #appOffset = 90
    #topZ = 5
    #focused

    constructor () {
        super()

        console.log('desktop constructed')
    }

    connectedCallback () {
        console.log('desktop added.')

        // build desktop

        // taskbar
        const taskbar = document.createElement('div')
        taskbar.classList.add('taskbar')
        // document.getElementById('main').appendChild(taskbar)
        document.getElementById('pwd-desktop').appendChild(taskbar)

        // desktop
        this.#desktop = document.createElement('div')
        this.#desktop.setAttribute('id', 'desktop')
        this.#desktop.classList.add('desktop')
        // document.getElementById('main').appendChild(this.#desktop)
        document.getElementById('pwd-desktop').appendChild(this.#desktop)

        // taskbar buttons
        let button = this.#createButton("img/pet-7.png")
        button.addEventListener('click', (event) => {
            this.#openApp('memory-game')
        })
        taskbar.appendChild(button)

        button = this.#createButton("img/pet-8.png")
        button.addEventListener('click', (event) => {
            this.#openApp('chat-app')
        })
        taskbar.appendChild(button)

        button = this.#createButton("img/pet-1.png")
        button.addEventListener('click', (event) => {
            this.#openApp('snake-game')
        })
        taskbar.appendChild(button)

        dap.makeDropZone(this.#desktop)

        // sending events over to the focused app
        document.addEventListener('keypress', (e) => {
            if (this.#focused) {
                this.#focused.dispatchEvent(new KeyboardEvent('keypress', {'key': e.key}))
            }
        })
        document.addEventListener('keydown', (e) => {
            if (this.#focused) {
                this.#focused.dispatchEvent(new KeyboardEvent('keydown', {'key': e.key}))
            }
        })
    }

    #createButton (iconPath) {
        const button = document.createElement('a')

        const div = document.createElement('div')
        div.classList.add('button')
        button.appendChild(div)

        const img = document.createElement('img')
        img.setAttribute('src', iconPath)
        div.appendChild(img)

        return button
    }

    #openApp (appElName) {
        const app = document.createElement(appElName)
        this.addApp(app)
    }

    addApp (app) {
        console.log(app.appBox)
        // spawing at position
        app.appBox.style.left = this.#appOffset + 'px'
        app.appBox.style.top = this.#appOffset + 'px'
        this.#appOffset += 10

        // focused upon creating
        app.appBox.style.zIndex = ++this.#topZ
        this.#focused = app

        // focused on click
        app.appBox.addEventListener('click', (event) => {
            app.appBox.style.zIndex = ++this.#topZ
            this.#focused = app
        })
        app.appBox.addEventListener('drag', (event) => {
            app.appBox.style.zIndex = ++this.#topZ
            this.#focused = app
        })

        this.#desktop.appendChild(app)
    }
}
