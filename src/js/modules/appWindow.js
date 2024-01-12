import * as dragAndDrop from './DragAndDrop.js'

export class AppWindow extends HTMLElement {
  appBox
  #title
  contextMenu

  constructor () {
    super()

    this.#createAppWindow()
    this.#createContextMenu()
    this.appBox.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      this.#showContextMenu(event.pageX, event.clientY)
      console.log('context menu should be now open')
    })
    document.addEventListener('click', () => { this.#hideContextMenu() })

    console.log('app window constructed')
  }

  connectedCallback () {
    console.log('app window added.')
  }

  #createAppWindow () {
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

    // this.appendChild(this.appBox)
    document.getElementById('desktop').appendChild(this.appBox)
  }

  #createContextMenu () {
    this.contextMenu = document.createElement('div')
    this.contextMenu.classList.add('hidden', 'app-context-menu')
    const list = document.createElement('ul')
    this.contextMenu.appendChild(list)
    this.appBox.appendChild(this.contextMenu)
  }

  setTitle (title) {
    this.#title.textContent = title
  }

  #showContextMenu (x, y) {
    const betterX = x - this.appBox.getBoundingClientRect().left
    const betterY = y - this.appBox.getBoundingClientRect().top
    this.contextMenu.style.left = betterX + 'px'
    this.contextMenu.style.top = betterY + 'px'
    this.contextMenu.classList.remove('hidden')
  }

  #hideContextMenu() {
    this.contextMenu.classList.add('hidden')
  }

  addContextMenuOption (text, id) {
    const listing = document.createElement('li')
    const p = document.createElement('p')
    listing.setAttribute('id', id)
    p.textContent = text
    // const anchor = document.createElement('a')
    // anchor.innerHTML = text
    // anchor.setAttribute('href', href + '()')
    listing.appendChild(p)
    this.contextMenu.lastChild.appendChild(listing)
  }
}
