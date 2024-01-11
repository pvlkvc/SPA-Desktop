import { AppWindow } from './AppWindow'

export class Chat extends AppWindow {
  #url = 'wss://courselab.lnu.se/message-app/socket'
  #username
  #websocket
  #chatBox

  constructor () {
    super()
    console.log('chat constructor')
  }

  connectedCallback () {
    console.log('chat game added.')

    this.#retrieveUsername()
    if (!this.#username) {
      this.#buildMenu()
    } else {
      this.#openSocket()
      this.#buildChat()
    }
    this.setTitle('Chat')
  }

  disconnectedCallback () {
    console.log('chat removed.')
    if (this.#websocket) {
      this.#closeSocket()
    }
  }

  #buildMenu () {
    const menu = document.createElement('div')
    menu.classList.add('column', 'chat-menu')

    const usernameInput = document.createElement('input')
    usernameInput.setAttribute('placeholder', 'username')
    usernameInput.classList.add('chat-menu-input')
    usernameInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        loginButton.click()
      }
    })
    menu.appendChild(usernameInput)

    const channelInput = document.createElement('input')
    channelInput.setAttribute('placeholder', 'channel id')
    channelInput.classList.add('chat-menu-input')
    channelInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        loginButton.click()
      }
    })
    menu.appendChild(channelInput)

    const loginButton = document.createElement('input')
    loginButton.classList.add('chat-menu-button')
    loginButton.setAttribute('type', 'submit')
    loginButton.setAttribute('value', 'Enter chat')
    loginButton.addEventListener('click', () => {
      if (usernameInput.value != '') {
        this.#newUsername(usernameInput.value)
        menu.remove()
        this.#openSocket()
        this.#buildChat()
      } else {
        if (document.getElementsByName('p').length == 0) {
          const errorMessage = document.createElement('p')
          errorMessage.textContent = 'Enter username!'
          menu.appendChild(errorMessage)
        }
      }
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

    this.#createContextMenu()
    sendTextbox.focus()
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

  #retrieveUsername () {
    const localStorage = window.localStorage
    this.#username = localStorage.getItem('chat-username') || null
    console.log(this.#username)
  }

  #newUsername (username) {
    const localStorage = window.localStorage
    localStorage.setItem('chat-username', username)
    this.#username = username
  }

  #createContextMenu () {
    this.addContextMenuOption('optionA', 'link')
    this.addContextMenuOption('optionB', 'link')
    this.addContextMenuOption('optionC', 'link')
  }
}