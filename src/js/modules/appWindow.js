import * as dragAndDrop from './dragAndDrop.js'

export class AppWindow extends HTMLElement {
  #draggable = 'true'

  appWindow

  connectedCallback () {
    console.log('App window added.')

    this.appWindow = document.createElement('div')
    dragAndDrop.makeDraggable(this.appWindow)
    document.appendChild(this.appWindow)
  }
}
