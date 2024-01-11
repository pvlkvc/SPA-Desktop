import { AppWindow } from './AppWindow'

export class Chat extends AppWindow {
  #url = 'wss://courselab.lnu.se/message-app/socket'
  #username = "batman"
  #websocket
  #chatBox

  constructor () {
    super()
    console.log('chat constructor')
  }

  connectedCallback () {
    console.log('chat game added.')

    this.#buildMenu()
  }

  disconnectedCallback () {
    console.log('chat removed.')
    this.#closeSocket()
  }

  #buildMenu () {
    const menu = document.createElement('div')
    menu.classList.add('chat-menu')

    const usernameInput = document.createElement('input')
    usernameInput.setAttribute('placeholder', 'username')
    usernameInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        if (usernameInput.value != '') {
          loginButton.click()
        } else {
          if (document.getElementsByName('p').length == 0) {
            const errorMessage = document.createElement('p')
            errorMessage.textContent = 'You need to enter a username!'
            menu.appendChild(errorMessage)
          }
        }
      }
    })
    menu.appendChild(usernameInput)

    const loginButton = document.createElement('input')
    loginButton.setAttribute('type', 'submit')
    loginButton.setAttribute('value', 'Enter chat')
    loginButton.addEventListener('click', () => {
      this.#username = usernameInput.value
      menu.remove()
      this.#openSocket()
      this.#buildChat()
    })
    menu.appendChild(loginButton)

    this.appBox.appendChild(menu)
  }

  #buildChat () {
    const chatContainer = document.createElement('div')
    chatContainer.classList.add('column')

    const chatBox = document.createElement('div')
    this.#chatBox = chatBox
    chatBox.classList.add('chat-box')
    chatContainer.appendChild(chatBox)

    const sendRow = document.createElement('div')
    sendRow.classList.add('row', 'chat-send-box')
    chatContainer.appendChild(sendRow)

    const sendTextbox = document.createElement('textarea')
    sendTextbox.classList.add('chat-send-textbox')
    sendRow.appendChild(sendTextbox)
    sendTextbox.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        sendButton.click()
      }
    })

    const sendButton = document.createElement('input')
    sendButton.classList.add('chat-send-button')
    sendButton.setAttribute('type', 'submit')
    sendButton.setAttribute('value', 'Send')
    sendButton.addEventListener('click', () => {
      if (sendTextbox.value != '') {
        this.#sendMessage(sendTextbox.value)
      sendTextbox.value = ''
      }
    })
    sendRow.appendChild(sendButton)

    this.appBox.appendChild(chatContainer)
  }

  #handleNewMessage (parsed) {
    console.log(parsed)

    const atBottom = this.#chatBox.scrollHeight == 
    this.#chatBox.scrollTop + this.#chatBox.offsetHeight

    const messageRow = document.createElement('div')
    messageRow.classList.add('chat-row')
    this.#chatBox.appendChild(messageRow)

    if (parsed.type == "message") {
      this.#userMessage(messageRow, parsed.username, parsed.data)
    } else if (parsed.type == "notification") {
      this.#chatLog(messageRow, parsed.data)
    }

    if (atBottom) {
      this.#chatBox.scrollTop = this.#chatBox.scrollHeight - this.#chatBox.offsetHeight
    }
  }

  #userMessage (msgRow, username, msg) {
    msgRow.classList.add('chat-message-row')

    const messageUsername = document.createElement('p')
    messageUsername.classList.add('chat-message-username')
    messageUsername.textContent = username
    msgRow.appendChild(messageUsername)

    const messageText = document.createElement('p')
    messageText.classList.add('chat-message-text')
    messageText.textContent = msg
    msgRow.appendChild(messageText)
  }

  #chatLog (msgRow, msg) {
    const logText = document.createElement('p')
    logText.classList.add('chat-log-text')
    logText.textContent = msg
    msgRow.appendChild(logText)
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
        if (parsed.type != 'heartbeat') {
          this.#handleNewMessage(parsed)
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

    if (!this.#websocket || this.#websocket.readyState !== 1) {
      console.log('The websocket is not open.')
    } else {
      this.#websocket.send(response)
      console.log('sending message: ' + messageText)
    }
  }
}