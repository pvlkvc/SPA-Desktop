import { AppWindow } from './appWindow'
import * as ws from './webSocketClient.js'

export class Chat extends AppWindow {
  constructor () {
    super()
    console.log('chat constructor')
  }

  connectedCallback () {
    console.log('chat game added.')

    this.#buildChat()

    this.#sendMessage()
  }

  disconnectedCallback () {
    console.log('chat removed.')
  }

  #sendMessage () {
    ws.connect('wss://courselab.lnu.se/message-app/socket')

    ws.send('ANNA WAS HERE')
  }

  #buildChat () {
    const chatContainer = document.createElement('div')
    chatContainer.classList.add('column')

    const sendRow = document.createElement('div')
    sendRow.classList.add('row', 'chat-send-box')
    chatContainer.appendChild(sendRow)

    const sendTextbox = document.createElement('textarea')
    sendTextbox.classList.add('chat-send-textbox')
    sendRow.appendChild(sendTextbox)

    const sendButton = document.createElement('input')
    sendButton.classList.add('chat-send-button')
    sendButton.setAttribute('type', 'submit')
    sendButton.setAttribute('value', 'Send')
    sendButton.addEventListener('click', () => {
      ws.send(sendTextbox.value)
    })
    sendRow.appendChild(sendButton)

    this.appBox.appendChild(chatContainer)
  }
}