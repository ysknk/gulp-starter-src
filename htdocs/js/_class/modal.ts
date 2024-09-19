import merge from 'lodash/merge'
import template from 'lodash/template'
import { parseJSON } from '../_utilities/function'

export interface ModalOpts {
  baseSelector: string
  dataAttr: {
    open: string
    close: string
    template: string
  }
  openClassName: string
}

export const initialOpts: ModalOpts = {
  baseSelector: '#wrapper',
  dataAttr: {
    open: 'data-modal-open',
    close: 'data-modal-close',
    template: 'data-modal-template'
  },
  openClassName: 'is-modal-open',
}

export class Modal {
  private elem: HTMLElement|null
  // private baseElem: HTMLElement|null

  constructor (public opts = initialOpts) {
    this.opts = Object.assign({}, initialOpts, opts)
    this.elem = null
  }

  get baseElem () {
    return document.querySelector(this.opts.baseSelector)
  }

  get htmlElem () {
    return document.documentElement
  }

  get hasOpen () {
    return this.htmlElem.classList.contains(this.opts.openClassName)
  }

  public initialize () {
    this.createDOM()

    const { baseSelector, dataAttr } = this.opts

    const open = [
      baseSelector,
      `[${dataAttr.open}]`
    ].join(' ');

    const close = [
      baseSelector,
      `[${dataAttr.close}]`
    ].join(' ');

    document.addEventListener('click', (e: Event) => {
      if (!e.target || !(e.target as Element).closest) return
      const openElem = (e.target as Element).closest(open)
      const closeElem = (e.target as Element).closest(close)

      const isElemUndefined = (!openElem && !closeElem)

      if (e.target === document || isElemUndefined) return

      if (openElem) {
        this.open(openElem)
      } else if (closeElem) {
        this.close(closeElem)
      }
    }, false)
  }

  public createDOM () {
    if (document.querySelector('#modal')) { return }
    const div = document.createElement('div')
    div.id = 'modal'
    div.classList.add('c-modal')
    this.elem = div
    this.baseElem.appendChild(div)
    // document.body.appendChild(div)
  }

  public open (elem: Element) {
    if (this.hasOpen) { return }

    const { openClassName, dataAttr } = this.opts

    const templateSelector = elem.getAttribute(dataAttr.template)
    const templateElem = document.querySelector(templateSelector)
    const html = template(templateElem.innerHTML)

    // const parseData = this.getParseData(elem, opts);
    const baseData = elem.getAttribute(dataAttr.open) || '';
    const data = parseJSON(baseData)

    this.elem.innerHTML = html({
      modal: this,
      data
    })

    window.requestAnimationFrame(() => {
      this.htmlElem.classList.add(openClassName)
    })
  }

  public close (elem: Element) {
    if (!this.hasOpen) { return }

    const { openClassName } = this.opts
    this.htmlElem.classList.remove(openClassName)
  }
}
