export class AppWindow extends HTMLElement {
  constructor () {
    super()

    console.log('app window constructed')
  }

  connectedCallback () {
    console.log('app window added.')
  }
}
