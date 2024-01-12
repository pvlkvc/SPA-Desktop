export { makeDraggable, makeDropZone }

let currentlyDragged

/**
 * Makes an HTML element draggable.
 * @param { HTMLElement } htmlEl DOM element to be dragged
 */
function makeDraggable (htmlEl) {
  htmlEl.setAttribute('draggable', true)

  htmlEl.addEventListener('dragstart', (event) => {
    currentlyDragged = event.target

    // Get original position
    const style = window.getComputedStyle(event.target, null)
    const startX = parseInt(style.getPropertyValue('left'), 10) - event.clientX
    const startY = parseInt(style.getPropertyValue('top'), 10) - event.clientY
    const start = {
      posX: startX,
      posY: startY
    }

    // Save the position in the dataTransfer
    event.dataTransfer.setData('application/json', JSON.stringify(start))
  })
}

/**
 * Makes an HTML element a dropzone for draggables.
 * @param {HTMLElement} htmlEl DOM element to be dragged
 */
function makeDropZone (htmlEl) {
  htmlEl.addEventListener('dragenter', (event) => {
    event.preventDefault()
  })

  htmlEl.addEventListener('dragover', (event) => {
    event.preventDefault()
  })

  htmlEl.addEventListener('drop', (event) => {
    // Get the position of the dragged element and where the drop was
    const start = JSON.parse(event.dataTransfer.getData('application/json'))
    const dropX = event.clientX
    const dropY = event.clientY

    // Move element position from start to drop
    currentlyDragged.style.left = (dropX + start.posX) + 'px'
    currentlyDragged.style.top = (dropY + start.posY) + 'px'
  })
}
