import * as Fetch from './chatFetch.js'
import { AppWindow } from './appWindow'

export class Chat extends AppWindow {
  constructor () {
    super()
    console.log('chat constructor')
  }

  connectedCallback () {
    console.log('chat game added.')
    this.#sendMessage()
  }

  disconnectedCallback () {
    console.log('chat removed.')
  }

  #sendMessage () {

  }
}