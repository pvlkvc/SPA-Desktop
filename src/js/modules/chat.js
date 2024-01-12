import { AppWindow } from './AppWindow.js'

export class Chat extends AppWindow {
  #url = 'wss://courselab.lnu.se/message-app/socket'
  #username
  #channel
  #websocket
  chatBox

  constructor () {
    super()
    console.log('chat constructor')
  }

  connectedCallback () {
    console.log('chat game added.')

    this.#retrieveUsername()
    this.#retrieveChannel()
    
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
        this.#newChannel(channelInput.value)
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
    chatContainer.classList.add('column', 'chat-container')

    const chatBox = document.createElement('div')
    this.chatBox = chatBox
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

    const atBottom = this.chatBox.scrollHeight == 
    this.chatBox.scrollTop + this.chatBox.offsetHeight

    const messageRow = document.createElement('div')
    messageRow.classList.add('chat-row')
    this.chatBox.appendChild(messageRow)

    if (parsed.type == "message") {
      if (parsed.channel == this.#channel) {
        this.#userMessage(messageRow, parsed.username, parsed.data)
      } else {
        messageRow.remove()
      }
    } else if (parsed.type == "notification") {
      this.#chatLog(messageRow, parsed.data)
    }

    if (atBottom) {
      this.chatBox.scrollTop = this.chatBox.scrollHeight - this.chatBox.offsetHeight
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
      channel: this.#channel,
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
  }

  #newUsername (username) {
    const localStorage = window.localStorage
    localStorage.setItem('chat-username', username)
    this.#username = username
  }

  #retrieveChannel () {
    const localStorage = window.localStorage
    this.#channel = localStorage.getItem('chat-channel') || null
  }

  #newChannel (channel) {
    const localStorage = window.localStorage
    localStorage.setItem('chat-channel', channel)
    this.#channel = channel
  }

  changePrompt (c) {
    if (c == 0 || c == 1) {
      let changed = ''
      if (c == 0) {
        changed = 'username'
      } else {
        changed = 'channel'
      }

      if (this.appBox.getElementsByClassName('grayed-out').length == 0) {
        const cover = document.createElement('div')
        cover.classList.add('column', 'grayed-out')

        const popup = document.createElement('div')
        popup.classList.add('column', 'chat-popup')
        cover.appendChild(popup)

        const input = document.createElement('input')
        input.classList.add('chat-popup-input')
        input.setAttribute('placeholder', 'new ' + changed)
        popup.appendChild(input)

        const submit = document.createElement('input')
        submit.setAttribute('type', 'submit')
        submit.classList.add('chat-popup-button')
        submit.setAttribute('value', 'Change ' + changed)
        submit.addEventListener('click', () => {
          if (input.value != '') {
            changed = changed.charAt(0).toUpperCase() + changed.slice(1)
            eval('this.#new' + changed + "('" + input.value + "')")
            this.appBox.getElementsByClassName('grayed-out')[0].remove()
          }
        })
        popup.appendChild(submit)

        input.addEventListener('keypress', (event) => {
          if (event.key == 'Enter') {
            submit.click()
          }
        })

        const cancelButton = document.createElement('input')
        cancelButton.setAttribute('type', 'submit')
        cancelButton.classList.add('chat-popup-button')
        cancelButton.setAttribute('value', 'Go back')
        cancelButton.addEventListener('click', () => {
          this.appBox.getElementsByClassName('grayed-out')[0].remove()
        })
        popup.appendChild(cancelButton)

        this.appBox.lastChild.appendChild(cover)
      }
    } else {
      return
    }
  }

  #createContextMenu () {
    this.addContextMenuOption('Change username', 'chat-username-change-button')
    const changeUsernameButton = this.appBox.getElementsByClassName('chat-username-change-button')[0]
    changeUsernameButton.addEventListener('click', () => { 
      this.changePrompt(0) 
    })
    this.addContextMenuOption('Change channel', 'chat-channel-change-button')
    const changeChannelButton = this.appBox.getElementsByClassName('chat-channel-change-button')[0]
    changeChannelButton.addEventListener('click', () => { 
      this.changePrompt(1) 
    })
    this.addContextMenuOption('optionC', 'link')
  }
}