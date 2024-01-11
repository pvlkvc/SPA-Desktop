import * as dragAndDrop from './DragAndDrop.js'

export class AppWindow extends HTMLElement {
  appBox
  #title

  constructor () {
    super()

    this.appBox = document.createElement('div')
    this.appBox.classList.add('app-window')
    dragAndDrop.makeDraggable(this.appBox)

    const windowNavbar = document.createElement('div')
    windowNavbar.classList.add('window-navbar')
    this.appBox.appendChild(windowNavbar)

    this.#title = document.createElement('p')
    windowNavbar.appendChild(this.#title)

    const closeButton = document.createElement('div')
    closeButton.classList.add('close-button')
    const buttonText = document.createElement('h1')
    buttonText.textContent = 'X'
    closeButton.appendChild(buttonText)
    windowNavbar.appendChild(closeButton)
    closeButton.addEventListener('click', () => {
      this.appBox.remove()
      this.remove()
    })

    document.getElementById('desktop').appendChild(this.appBox)

    console.log('app window constructed')
  }

  connectedCallback () {
    console.log('app window added.')
  }

  setTitle (title) {
    this.#title.textContent = title
  }
}
