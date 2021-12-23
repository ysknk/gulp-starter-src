import { getOffset } from '../utilities/'

export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * SmoothScroll
   */
  return class SmoothScroll {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof SmoothScroll)) {
        return new SmoothScroll(opts_);
      }

      this.baseElem = 'body';

      this.elem = 'a';
      this.pageTopHash = 'top';
      this.excludeClassName = 'no-scroll';
      this.pushHistoryClassName = 'push-hisotry-scroll';
      this.isScrollingClassName = `is-scrolling`;
      this.easing = 'easeInOutQuart';
      this.duration = 500;

      this.diffOffsetY = 0;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      const html = doc.documentElement;

      // click to scroll
      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        const elem = e.target.closest([// delegate
          this.baseElem,
          this.elem
        ].join(' '));

        if (e.target === doc || !elem) return;

        let href = '';
        let target = '';
        let hash = '';

        try {
          href = elem.getAttribute('href');
          target = doc.querySelector(href);
          hash = this.getHash(href);
        } catch(e) {
          return;
        }

        if (!hash || elem.classList.contains(this.excludeClassName)) return;
        let isPushHistory = elem.classList.contains(this.pushHistoryClassName);
        if (e) e.preventDefault();

        this.goto(((hash === `#${this.pageTopHash}`)
          ? html
          : target),
          isPushHistory
        );
      }, false);
    }

    /**
     * locationHref
     */
    locationHref() {
      const hash = this.getHash(location.href);
      if (!hash) return;

      setTimeout(() => {
        const elem = doc.querySelector(hash);
        if (!elem) return;
        this.goto(elem, false);
      }, 100);
    }

    /**
     * getHash
     *
     * @param {string} str url
     * @returns {boolean|string} false or element id
     */
    getHash(str) {
      if (!str) return false;

      const dir = str.split('/');
      const last = dir[dir.length - 1];

      let hash = '';

      if (last.match(/(\#\!)/)) return false;

      if (last.match(/\#(.+)/) && !last.match(/\##/)) {
        hash = last.match(/#(.+)/)[1];
        return `#${hash}`;
      }
    }

    /**
     * updateUrlHash
     *
     * @param {string} hash element src
     */
    updateUrlHash(hash) {
      if (typeof win === 'undefined'
        || typeof win.history === 'undefined'
        || typeof win.history.pushState === 'undefined') return;
      win.history.pushState({}, '', hash ? `#${hash}` : '');
    }

    /**
     * setDiffOffsetY
     *
     * @param {number} posY
     */
    setDiffOffsetY(posY) {
      this.diffOffsetY = posY;
    }

    /**
     * goto
     *
     * @param {object} elem element
     * @param {boolean} setHistory
     * @param {function} cb callback
     */
    goto(elem, setHistory, cb) {
      const baseElem = doc.querySelector(this.baseElem);
      const elemPos = getOffset(elem);
      const targetPosY = (elemPos.y - this.diffOffsetY);
      const scrollPos = {
        y: win.pageYOffset,
        x: win.pageXOffset
      };

      const callback = () => {
        baseElem.classList.remove(this.isScrollingClassName);
        _.isFunction(cb) && cb();
        _.isFunction(this.onAfterScroll) && this.onAfterScroll(this);
      };

      _.isFunction(this.onBeforeScroll) && this.onBeforeScroll(this);

      if (scrollPos.y === targetPosY) {
        callback();
        return;
      }

      baseElem.classList.add(this.isScrollingClassName);

      FN.anime({
        targets: scrollPos,
        y: targetPosY,
        duration: this.duration,
        easing: this.easing,
        update: () => win.scroll(scrollPos.x, scrollPos.y),
        complete: () => {
          callback();
        }
      });

      if (setHistory) {
        this.updateUrlHash(elem.id);
      }
    }

    /**
     * onBeforeScroll
     *
     * @param {object} obj class object
     */
    onBeforeScroll(obj) {}

    /**
     * onAfterScroll
     *
     * @param {object} obj class object
     */
    onAfterScroll(obj) {}

  };

})(window, document);

