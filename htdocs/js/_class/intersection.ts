import merge from 'lodash/merge'
import { getWindowRect, getElemRect, parseJSON } from '../_utilities/function'

const eventIntersectionChange = (timing: 'in'|'out', elem: Element|null, options: IntersectionOpts) => {
  return new CustomEvent(`intersectionchange`, {
    detail: {
      timing,
      elem,
      options
    }
  })
}

export interface IntersectionOpts {
  dataAttr: string
  classname?: {
    init: string
    in: string
    out: string
  },
  action?: string
  isOnce?: boolean
  src?: string
  threshold?: number
  callback?: {
    in: (elem: Element, data: IntersectionOpts) => void,
    out?: (elem: Element, data: IntersectionOpts) => void,
  }
}

export const initialOpts: IntersectionOpts = {
  dataAttr: 'data-intersection',
  classname: {
    init: 'is-intersection-init',
    in: 'is-intersection-in',
    out: 'is-intersection-out'
  },
  action: 'intersection-fadein',
  isOnce: true,
  src: undefined,// NOTE: image src
  threshold: .1,// NOTE: 0 - 1.0 -> screen top - bottom
  callback: {
    in: (_elem, _data) => {},
    out: (_elem, _data) => {},
  }
}

export class Intersection {
  private initializeStyle: string

  constructor (public opts = initialOpts) {
    this.opts = merge({}, initialOpts, opts)

    this.initializeStyle = ``

    this.setInitializeStyle()
  }

  get elems () {
    return document.querySelectorAll(`[${this.opts.dataAttr}]`)
  }

  public setInitializeStyle () {
    if (!this.initializeStyle) return
    const headElem = document.querySelector('head')
    const styleElem = document.createElement('style')
    styleElem.innerHTML = `[${this.opts.dataAttr}] {${this.initializeStyle}}`
    headElem?.appendChild(styleElem)
  }

  public initialize () {
    const { dataAttr } = this.opts
    this.elems.forEach((elem: Element) => {
      const attr = elem.getAttribute(dataAttr) || ''
      // @ts-ignore:
      let data: IntersectionOpts = parseJSON(attr)
      data = merge({}, this.opts, data)
      if (!data.classname || !data.action) { return }
      if (elem.classList.contains(data.classname.init)) { return }

      elem.classList.add(data.classname.init)
      elem.classList.add(data.action)
      elem.classList.remove(data.classname.in)
      elem.classList.remove(data.classname.out)
    })
  }

  public update () {
    const { dataAttr } = this.opts
    const windowRect = getWindowRect()
    const bodyHeight = document.body.getBoundingClientRect().height - 0

    this.elems.forEach((elem: Element) => {
      const attr = elem.getAttribute(dataAttr) || ''
      // @ts-ignore:
      let data: IntersectionOpts = parseJSON(attr)
      data = merge({}, this.opts, data)

      if (!data.classname) { return }
      if (data.isOnce && elem.classList.contains(data.classname.in)) { return }

      const targetRect = getElemRect(elem)
      const thresholdDiff = windowRect.height * (data?.threshold || 0)

      // thresholdDiff分の余白がない場合
      if (((targetRect.bottom + thresholdDiff) >= bodyHeight &&
        windowRect.bottom >= bodyHeight) ||
        ((targetRect.top - thresholdDiff) <= 0 &&
          windowRect.top <= 0)
      ) {
        this.setIn(elem, data)
      }

      // 余白含めて画面内
      if (targetRect.bottom >= windowRect.top + thresholdDiff &&
          windowRect.bottom - thresholdDiff >= targetRect.top) {
        this.setIn(elem, data)
      } else {
        // 一度きりの場合はoutクラスをつけない
        if (!data.isOnce) {
          this.setOut(elem, data)
        }
      }
    })
  }

  private setIn (elem: Element, data: IntersectionOpts) {
    const { dataAttr } = this.opts
    if (!data.classname || elem.classList.contains(data.classname.in)) { return }

    if (data.src) {
      (elem as HTMLImageElement).src = data.src
    }
    elem.classList.remove(data.classname.out)
    elem.classList.add(data.classname.in)

    if (data.callback) {
      data.callback.in(elem, data)
      dispatchEvent(eventIntersectionChange('in', elem, data))
    }
    if (data.isOnce) {
      elem.removeAttribute(dataAttr)
    }
  }

  private setOut (elem: Element, data: IntersectionOpts) {
    if (!data.classname || !elem.classList.contains(data.classname.in)) { return }

    elem.classList.remove(data.classname.in)
    elem.classList.add(data.classname.out)

    if (data.callback) {
      data.callback.out(elem, data)
      dispatchEvent(eventIntersectionChange('out', elem, data))
    }
  }
}
