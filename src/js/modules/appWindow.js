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
    })
    document.addEventListener('click', () => { this.#hideContextMenu() })
  }

  /**
   * Creates the HTML elements making up the app window.
   */
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

  /**
   * Creates the context menu template for this app window.
   */
  #createContextMenu () {
    this.contextMenu = document.createElement('div')
    this.contextMenu.classList.add('hidden', 'app-context-menu')
    const list = document.createElement('ul')
    this.contextMenu.appendChild(list)
    this.appBox.appendChild(this.contextMenu)
  }

  /**
   * Sets a title to this app window.
   * @param { string } title title of the app
   */
  setTitle (title) {
    this.#title.textContent = title
  }

  /**
   * Shows the context menu at given location.
   * @param { number } x x coordinate
   * @param { number } y y coordinate
   */
  #showContextMenu (x, y) {
    const betterX = x - this.appBox.getBoundingClientRect().left
    const betterY = y - this.appBox.getBoundingClientRect().top
    this.contextMenu.style.left = betterX + 'px'
    this.contextMenu.style.top = betterY + 'px'
    this.contextMenu.classList.remove('hidden')
  }

  /**
   * Hides the context menu.
   */
  #hideContextMenu () {
    this.contextMenu.classList.add('hidden')
  }

  /**
   * Adds a new option to the context menu.
   * This is only visual and these buttons still have to be
   * connected to be given their functionalities.
   * Meant to be given a unique class name and
   * later found by searching for classname at this instance.
   * @param { string } text option text
   * @param { string } cl class name to be assigned to this option
   */
  addContextMenuOption (text, cl) {
    const listing = document.createElement('li')
    const p = document.createElement('p')
    listing.classList.add(cl)
    p.textContent = text
    // const anchor = document.createElement('a')
    // anchor.innerHTML = text
    // anchor.setAttribute('href', href + '()')
    listing.appendChild(p)
    this.contextMenu.lastChild.appendChild(listing)
  }
}
