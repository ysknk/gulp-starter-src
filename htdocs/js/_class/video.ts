export interface Opts {
  dataAttr: string
}

export const initialOpts: Opts = {
  dataAttr: 'data-video',
}

export class Video {

  constructor (public opts = initialOpts) {
    this.opts = Object.assign({}, initialOpts, opts)
  }

  public initialize () {
    const { dataAttr } = this.opts
    const elems = document.querySelectorAll(`[${dataAttr}]`)
    elems.forEach((elem: HTMLElement) => {
      (() => {
        this.addEvent(elem)
      })()
    })
  }

  public addEvent (elem: HTMLElement) {
    const { dataAttr } = this.opts
    const selector = elem.getAttribute(dataAttr)
    const videoElem: HTMLVideoElement = document.querySelector(selector)

    elem.addEventListener('click', () => {
      elem.style.display = 'none'
      videoElem.play()
    }, false)

    videoElem.addEventListener('ended', () => {
      elem.style.display = 'block'
    }, false)
  }
}
