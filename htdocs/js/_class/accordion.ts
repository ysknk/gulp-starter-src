import { animate, cubicBezier } from 'popmotion'

export interface AccordionOpts {
  baseElem: string
  dataAttr: string
  dataAttrClose: string
  openClassName: string
  initializedClassName: string
  ease: any
  duration: number
}

export const initialOpts: AccordionOpts = {
  baseElem: 'body',

  dataAttr: 'data-accr',
  dataAttrClose: 'data-accr-close',
  openClassName: 'is-open',
  initializedClassName: 'is-initialized',
  ease: cubicBezier(0.76, 0, 0.24, 1),
  duration: 600,
}

const eventAccordionChange = (status: 'open'|'opened'|'close'|'closed', buttonElem: Element, contentElem: Element) => {
  return new CustomEvent(`accordionchange`, {
    detail: {
      status,
      buttonElem,
      contentElem
    }
  })
}

export class Accordion {
  private animateInstance: any

  constructor (public opts = initialOpts) {
    this.opts = Object.assign({}, initialOpts, opts)

    this.animateInstance = null
  }

  public getAttrElems (elem: Element|Document, attr: string) {
    const data = (elem as HTMLElement).getAttribute(attr)
    if (!data) { return null }
    return document.querySelectorAll(data)
  }

  public initialize () {
    const {
      baseElem,
      dataAttr,
      dataAttrClose
    } = this.opts

    this.setClose()

    document.addEventListener('click', (e: Event) => {
      if (!e.target || !(e.target as Element).closest) { return }
      const toggleButton: Element|null = (e.target as Element).closest([
        baseElem,
        `[${dataAttr}]`
      ].join(' '))

      const closeButton: Element|null = (e.target as Element).closest([
        baseElem,
        `[${dataAttrClose}]`
      ].join(' '))

      if (e.target === document || (!toggleButton && !closeButton)) { return }

      if (toggleButton) {
        const contents = this.getAttrElems(toggleButton, dataAttr)
        if (!contents) { return }

        this[this.hasOpen(toggleButton) ?
          'close' : 'open'](toggleButton, contents)

      } else if (closeButton) {
        const contents = this.getAttrElems(document, dataAttrClose)
        if (!contents) { return }

        this.close(closeButton, contents)
      }
    }, false)
  }

  public setClose () {
    const {
      baseElem,
      dataAttr,
      initializedClassName,
    } = this.opts

    const elems = document.querySelectorAll([
      baseElem,
      `[${dataAttr}]`
    ].join(' '))

    elems.forEach((elem) => {
      if (elem.classList.contains(initializedClassName)) { return }
      if (!this.hasOpen(elem)) {
        const contents = this.getAttrElems(elem, dataAttr)
        if (!contents) { return }
        contents.forEach((value: Element) => {
          const content = (value as HTMLElement)
          content.style.overflow = 'hidden'
          content.style.height = '0'
        })
      }
      elem.classList.add(initializedClassName)
    })
  }

  public open (button: Element, contents: NodeListOf<Element>) {
    const {
      dataAttr,
      dataAttrClose,
      openClassName,
      duration,
      ease
    } = this.opts

    const data = button.getAttribute(dataAttrClose)
      || button.getAttribute(dataAttr)
      || null

    const setButtons = (attr: string) => {
      const buttons = document.querySelectorAll(`[${attr}="${data}"]`)
      buttons.forEach((button: Element) => {
        button.classList.add(openClassName)
      })
    }

    setButtons(dataAttrClose)
    setButtons(dataAttr)

    contents.forEach((value: Element) => {
      const content = (value as HTMLElement)
      dispatchEvent(eventAccordionChange('open', button, content))

      this.animateInstance && this.animateInstance.stop()

      content.classList.add(openClassName)

      const height = this.getHeight(content)

      this.animateInstance = animate({
        from: height.now,
        // to: height.max - height.min,
        to: height.max,
        duration,
        ease,
        onUpdate: (latest: number) => {
          content.style.height = `${latest}px`
        },
        onComplete: () => {
          if (this.hasOpen(button)) {
            content.style.overflow = 'visible'
            content.style.height = 'auto'
            dispatchEvent(eventAccordionChange('opened', button, content))
          }
        }
      })
    })
  }

  private getHeight (elem: HTMLElement) {
    // const now = elem.clientHeight
    const now = parseInt(elem.style.height) - 0

    // elem.style.overflow = 'hidden'
    // elem.style.height = '0px'
    // const min = elem.getBoundingClientRect().height

    elem.style.overflow = 'visible'
    elem.style.height = 'auto'
    const max = elem.getBoundingClientRect().height

    elem.style.overflow = 'hidden'
    elem.style.height = `${now}px`

    return {
      now,
      // min,
      max
    }
  }

  public close (button: Element, contents: NodeListOf<Element>) {
    const {
      dataAttr,
      dataAttrClose,
      openClassName,
      duration,
      ease
    } = this.opts

    const data = button.getAttribute(dataAttrClose)
      || button.getAttribute(dataAttr)
      || null

    const setButtons = (attr: string) => {
      const buttons = document.querySelectorAll(`[${attr}="${data}"]`)
      buttons.forEach((button: Element) => {
        button.classList.remove(openClassName)
      })
    }

    setButtons(dataAttrClose)
    setButtons(dataAttr)

    contents.forEach((value: Element) => {
      const content = (value as HTMLElement)
      dispatchEvent(eventAccordionChange('close', button, content))

      this.animateInstance && this.animateInstance.stop()

      content.classList.remove(openClassName)
      content.style.overflow = 'hidden'
      content.style.height = `${content.clientHeight}px`

      const height = this.getHeight(content)
      // const from = (height.now >= height.min && height.now <= (height.max - height.min))
      //   ? height.now - height.min
      //   : height.max - height.min
      const from = height.now

      this.animateInstance = animate({
        from,
        to: 0,
        duration,
        ease,
        onUpdate: (latest: number) => {
          content.style.height = `${latest}px`
        },
        onComplete: () => {
          if (!this.hasOpen(button)) {
            dispatchEvent(eventAccordionChange('closed', button, content))
          }
        }
      })
    })
  }

  public hasOpen (elem: Element) {
    return elem.classList.contains(this.opts.openClassName)
  }
}
