/**
 * Computes the current time.
 * @returns { string } time a string
 */
export function getTime () {
  const date = new Date()
  const mins = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
  const time = date.getHours() + ':' + mins
  return time
}
