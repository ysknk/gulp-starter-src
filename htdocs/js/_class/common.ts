import { throttle, debounce, getElemRect, isTouch } from '../_utilities/function'

export class Common {
  constructor () {}

  get width () {
    return this.bodyElem.clientWidth
  }

  get height () {
    return window.innerHeight
  }

  get bodyElem () {
    return document.body
  }

  get htmlElem () {
    return document.documentElement
  }

  public initialize () {
    this.process()
  }

  public setEventLight (event: string, call: () => void) {
    // call()

    addEventListener(event, throttle(() => {
      call()
    }, 100))

    addEventListener(event, debounce(() => {
      call()
    }, 300))
  }

  public process () {
    this.setCSSVariables()
    this.setParentClass()
  }

  public scroll () {
    const classname = {
      'scrolled': 'is-scrolled',
    }
    if (window.scrollY >= 5) {
      this.htmlElem.classList.add(classname.scrolled)
    } else {
      this.htmlElem.classList.remove(classname.scrolled)
    }
  }

  private setCSSVariables () {
    if (!this.htmlElem) { return }
    const headerElem = document.querySelector('#header')
    const headerHeight = headerElem && getElemRect(headerElem).height
    const footerElem = document.querySelector('#footer')
    const footerHeight = footerElem && getElemRect(footerElem).height
    this.htmlElem.style.setProperty('--width', `${this.width}px`)
    this.htmlElem.style.setProperty('--height', `${this.height}px`)
    if (headerElem) {
      this.htmlElem.style.setProperty('--header-height', `${headerHeight}px`)
    }
    if (footerElem) {
      this.htmlElem.style.setProperty('--footer-height', `${footerHeight}px`)
    }
  }

  private setParentClass () {
    const classname = {
      'nojs': 'no-js',
      'landscape': 'is-landscape',
      'portrait': 'is-portrait'
    }
    this.htmlElem.classList.remove(classname.nojs)

    if (this.width >= this.height) {
      this.htmlElem.classList.add(classname.landscape)
      this.htmlElem.classList.remove(classname.portrait)
    } else {
      this.htmlElem.classList.add(classname.portrait)
      this.htmlElem.classList.remove(classname.landscape)
    }

    if (isTouch()) {
      this.htmlElem.classList.add('is-touch');
    } else {
      this.htmlElem.classList.add('is-mouse');
    }
  }

}
