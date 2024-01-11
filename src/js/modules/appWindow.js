import * as dragAndDrop from './DragAndDrop.js'

export class AppWindow extends HTMLElement {
  appBox

  constructor () {
    super()

    this.appBox = document.createElement('div')
    this.appBox.classList.add('app-window')
    dragAndDrop.makeDraggable(this.appBox)

    const windowNavbar = document.createElement('div')
    windowNavbar.classList.add('window-navbar')
    this.appBox.appendChild(windowNavbar)

    const closeButton = document.createElement('div')
    closeButton.classList.add('close-button')
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
}
