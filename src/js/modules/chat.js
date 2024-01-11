import { AppWindow } from './appWindow'

export class Chat extends AppWindow {
  #url = 'wss://courselab.lnu.se/message-app/socket'
  #username = "batman"
  #websocket

  constructor () {
    super()
    console.log('chat constructor')
  }

  connectedCallback () {
    console.log('chat game added.')



    this.#buildChat()

    this.#openSocket()
  }

  disconnectedCallback () {
    console.log('chat removed.')
    this.#closeSocket()
  }

  #buildMenu () {
    
  }

  #buildChat () {
    const chatContainer = document.createElement('div')
    chatContainer.classList.add('column')
    this.appBox.appendChild(chatContainer)

    const chatBox = document.createElement('div')
    chatBox.setAttribute('id', 'chatBox')
    chatBox.classList.add('chat-box')
    chatContainer.appendChild(chatBox)

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
      this.#sendMessage(sendTextbox.value)
    })
    sendRow.appendChild(sendButton)
  }

  #handleNewMessage (parsed) {
    console.log(parsed)

    const messageRow = document.createElement('div')
    messageRow.classList.add('row', 'chat-message-row')
    document.getElementById('chatBox').appendChild(messageRow)

    if (parsed.type == "message") {
      this.#userMessage(messageRow, parsed.username, parsed.data)
    } else if (parsed.type == "notification") {
      this.#chatLog(messageRow, parsed.data)
    }
  }

  #userMessage (msgRow, username, msg) {
    const messageUsername = document.createElement('p')
    messageUsername.textContent = username + ": "
    msgRow.appendChild(messageUsername)

    const messageText = document.createElement('p')
    messageText.classList.add('chat-message-text')
    messageText.textContent = msg
    msgRow.appendChild(messageText)
  }

  #chatLog (msgRow, msg) {

  }

  #openSocket () {
    this.#websocket = new WebSocket(this.#url)

    this.#websocket.onopen = () => {
        console.log('web socket is open: ', this.#websocket)
    }

    this.#websocket.onmessage = (event) => {
        console.log('web socket received message: ' + event.data)
        console.log(event)
        const parsed = JSON.parse(event.data)
        this.#handleNewMessage(parsed)
    }

    this.#websocket.onclose = () => {
        console.log('web socket is closed')
        // todo: print connection is closed message
    }
  }

  #closeSocket () {
    this.#websocket.send('Client closing connection by intention.')
    this.#websocket.close()
  }

  #sendMessage (messageText) {
    const body = {
      type: "message",
      data : messageText,
      username: this.#username,
      channel: "my, not so secret, channel2",
      key: "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
    }
    const response = JSON.stringify(body)

    if (!this.#websocket || this.#websocket.readyState !== 1) {
      console.log('The websocket is not open.')
    } else {
      this.#websocket.send(response)
      console.log('sending message: ' + messageText)
    }
  }
}