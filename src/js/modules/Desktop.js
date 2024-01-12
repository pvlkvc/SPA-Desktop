import * as dap from './DragAndDrop.js'
import { AppWindow } from './AppWindow.js'

export class Desktop extends HTMLElement {
  #desktop
  #appOffset = 90
  #topZ = 5
  #focused

  connectedCallback () {
    this.#buildDesktop()

    dap.makeDropZone(this.#desktop)

    // sending events over to the focused app
    document.addEventListener('keypress', (e) => {
      if (this.#focused) {
        this.#focused.dispatchEvent(new KeyboardEvent('keypress', { key: e.key }))
      }
    })
    document.addEventListener('keydown', (e) => {
      if (this.#focused) {
        this.#focused.dispatchEvent(new KeyboardEvent('keydown', { key: e.key }))
      }
    })
  }

  /**
   * Creates the HTML elements for the desktop.
   */
  #buildDesktop () {
    // taskbar
    const taskbar = document.createElement('div')
    taskbar.classList.add('taskbar')
    // document.getElementById('main').appendChild(taskbar)
    document.getElementById('pwd-desktop').appendChild(taskbar)

    // desktop
    this.#desktop = document.createElement('div')
    this.#desktop.setAttribute('id', 'desktop')
    this.#desktop.classList.add('desktop')
    document.getElementById('pwd-desktop').appendChild(this.#desktop)

    const timeEl = document.createElement('p')
    timeEl.classList.add('desktop-time')
    const time = this.getTime()
    timeEl.textContent = time
    setInterval(() => {
      const time = this.getTime()
      timeEl.textContent = time
    }, 60000)
    this.#desktop.appendChild(timeEl)

    // taskbar buttons
    let button = this.#createButton('img/icon-memory.png')
    button.addEventListener('click', (event) => {
      this.#openApp('memory-game')
    })
    taskbar.appendChild(button)

    button = this.#createButton('img/icon-chat.png')
    button.addEventListener('click', (event) => {
      this.#openApp('chat-app')
    })
    taskbar.appendChild(button)

    button = this.#createButton('img/icon-snake.png')
    button.addEventListener('click', (event) => {
      this.#openApp('snake-game')
    })
    taskbar.appendChild(button)
  }

  /**
   * Creates a button HTML element.
   * @param { string } iconPath path to the button icon
   * @returns { HTMLElement } new button element
   */
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

  /**
   * Opens an app in the desktop.
   * @param { string } appElName custom element name of the app to be open
   */
  #openApp (appElName) {
    const app = document.createElement(appElName)
    this.addApp(app)
  }

  /**
   * Places an app on the desktop.
   * @param { AppWindow } app to be added to the desktop
   */
  addApp (app) {
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

  /**
   * Computes the current time.
   * @returns { string } time a string
   */
  getTime () {
    const date = new Date()
    const mins = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
    const time = date.getHours() + ':' + mins
    return time
  }
}
