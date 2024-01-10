/**
 * Do a fetch GET request and return the response as JSON.
 * @param {string} url to send request to
 * @returns {object} the JSON response
 */
export async function get (url) {
  // Do a fetch request on that url using await
  const response = await fetch(url)

  // Get the response as json (asynchronous request)
  const data = await response.json()

  return data
}

/**
 * Do a fetch POST request and return the response as JSON.
 * @param {string} url to send request to
 * @param {object} body to submit
 * @returns {object} the JSON response
 */
export async function post (url, body = null) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  const response = await fetch(url, options)

  // const data = await response.json()

  return response
}
