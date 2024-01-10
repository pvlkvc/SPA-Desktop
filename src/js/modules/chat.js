import { AppWindow } from './appWindow'

export class Chat extends AppWindow {
  #url = 'wss://courselab.lnu.se/message-app/socket'
  #username = "Anna"
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

  #buildChat () {
    const chatContainer = document.createElement('div')
    chatContainer.setAttribute('id', 'chatContainer')
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
      this.#sendMessage(sendTextbox.value)
    })
    sendRow.appendChild(sendButton)

    this.appBox.appendChild(chatContainer)
  }

  #messageReceived (data) {
    console.log(data)

    const username = data.username
    const messageContents = data.data

    // building the elements
    const messageRow = document.createElement('div')
    messageRow.classList.add('row', 'chat-message-row')
    chatContainer.appendChild(messageRow)

    const messageUsername = document.createElement('p')
    messageUsername.textContent = username
    messageRow.appendChild(messageUsername)

    const messageText = document.createElement('p')
    messageText.classList.add('chat-message-text')
    messageText.textContent = messageContents
    messageRow.appendChild(messageText)

    document.getElementById('chatContainer').appendChild(messageRow)
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
        if (parsed.type == "message") {
          this.#messageReceived(parsed)
        }
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
    // todo: put key/username etc. into json

    if (!this.#websocket || this.#websocket.readyState !== 1) {
      console.log('The websocket is not open.')
    } else {
      this.#websocket.send(response)
      console.log('sending message: ' + messageText)
    }
  }
}