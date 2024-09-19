import { animate, easeInOut } from 'popmotion'

import { getOffset } from '../_utilities/function'

export class SmoothScroll {
  private baseSelector: string
  private targetSelector: string
  private pageTopHash: string
  private excludeClassName: string
  private pushHistoryClassName: string
  private isScrollingClassName: string
  private ease: any
  private duration: number
  private diffOffsetY: number

  constructor () {
    this.baseSelector = 'body'

    this.targetSelector = 'a'
    this.pageTopHash = 'top'
    this.excludeClassName = 'no-scroll'
    this.pushHistoryClassName = 'push-hisotry-scroll'
    this.isScrollingClassName = `is-scrolling`
    this.ease = easeInOut
    this.duration = 600

    this.diffOffsetY = 0
  }

  public initialize () {
    const html = document.documentElement

    // click to scroll
    document.addEventListener('click', (e: Event) => {
      if (!e.target || !(e.target as Element).closest) return
      const elem = (e.target as Element).closest([
        this.baseSelector,
        this.targetSelector
      ].join(' '))

      if (e.target === document || !elem) return

      let href: string|null = null
      let target: Element|null = null
      let hash: string|boolean|undefined

      try {
        href = elem.getAttribute('href')
        target = href ? document.querySelector(href) : null
        hash = this.getHash(href)
      } catch(_e) {
        return
      }

      if (!hash || elem.classList.contains(this.excludeClassName)) return
      const isPushHistory = elem.classList.contains(this.pushHistoryClassName)
      if (e) e.preventDefault()

      this.goto(((hash === `#${this.pageTopHash}`)
        ? html
        : target),
        () => {},
        isPushHistory
      )
    }, false)
  }

  public updateUrlHash (hash: string|boolean|undefined) {
    if (typeof window === 'undefined'
      || typeof window.history === 'undefined'
      || typeof window.history.pushState === 'undefined') return;
    window.history.pushState({}, '', hash ? `#${hash}` : '');
  }

  public setDiffOffsetY (offset: number) {
    this.diffOffsetY = offset
  }

  public goto (elem: Element|null, cb: () => void, isHistory = false) {
    const baseElem = document.querySelector(this.baseSelector)
    const elemPos = getOffset(elem)
    const targetPosY = (elemPos.y - this.diffOffsetY)
    const scrollPos = {
      y: window.scrollY,
      x: window.scrollX
    }

    const callback = () => {
      baseElem?.classList.remove(this.isScrollingClassName)
      cb && cb()
    }

    if (scrollPos.y === targetPosY) {
      callback()
      return
    }

    baseElem?.classList.add(this.isScrollingClassName);

    animate({
      from: scrollPos.y,
      to: targetPosY,
      duration: this.duration,
      ease: this.ease,
      onUpdate: (value:number) => window.scroll(scrollPos.x, value),
      onComplete: () => {
        callback()
      }
    })

    if (isHistory) {
      this.updateUrlHash(elem?.id)
    }
  }

  public locationHref (cb: () => void = () => {}) : Element|null {
    const hash = this.getHash(location.href)
    if (!hash) {
      cb()
      return null
    }

    const elem = document.querySelector(hash)
    if (!elem) {
      cb()
      return null
    }

    setTimeout(() => {
      this.goto(elem, cb)
    }, 100)

    return elem
  }

  public getHash (str: string|null) {
    if (!str) return false

    const dir = str.split('/')
    const last = dir[dir.length - 1]

    if (last.match(/(\#\!)/)) return false

    if (last.match(/\#(.+)/) && !last.match(/\##/)) {
      const hash: string|undefined = last.match(/#(.+)/)?.[1]
      return `#${hash}`
    }
  }
}
