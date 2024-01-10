let websocket

/**
 * Setup a web socket connection.
 */
export function connect (url) {
    console.log('Connecting to: ' + url)
    websocket = new WebSocket(url)

    // Handler for when the connection is opened
    websocket.onopen = () => {
        console.log('web socket is open: ', websocket)
        outputLog('The websocket is now open.')
    }

    // Handler for when the message is received
    websocket.onmessage = (event) => {
        console.log('web socket received message: ' + event.data)
        console.log(event)
        outputLog('Server said: ' + event.data)
    }

    // Handler for when the socket is closed
    websocket.onclose = () => {
        console.log('web socket is closed')
        outputLog('Websocket is now closed.')
    }
}

/**
 * Close a web socket connection.
 */
export function close () {
    console.log('web socket will be closed')
    websocket.send('Client closing connection by intention.')
    websocket.close()
    outputLog('Prepare to close websocket.')
}

/**
 * Send a message.
 */
export function send (messageText) {
    if (!websocket || websocket.readyState !== 1) {
        console.log('ERROR: web socket is not open')
    } else {
        websocket.send(messageText)
        console.log('sending message via web socket: ' + messageText)
        outputLog('You said: ' + messageText)
    }
}