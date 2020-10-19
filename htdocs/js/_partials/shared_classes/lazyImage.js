import { getWindowRect, getElemRect } from '../utilities/'

export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * LazyImage
   * <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-lazy-image="/assets/img/img.gif" alt="">
   * <div data-lazy-background="/assets/img/img.gif" style="background: url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==) no-repeat center center; background-size: cover;">
   */
  return class LazyImage {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof LazyImage)) {
        return new LazyImage(opts_);
      }

      this.baseElem = 'body';
      this.dataAttr = {
        image: `data-lazy-image`,
        background: `data-lazy-background`
      };

      this.setClassName = 'set-src';
      this.threshold = .3;// 0 - 1.0 -> screen top - bottom

      this.isEventInitialize = true;
      this.throttleTime = 10;
      this.throttleTimeScroll = this.throttleTime;
      this.debounceTimeResize = this.throttleTime;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      this.initializeConditions()
      this.updateAll();

      if (!this.isEventInitialize) return;

      win.addEventListener('scroll', _.throttle((e) => {
        this.updateAll();
      }, this.throttleTimeScroll), false);

      win.addEventListener('resize', _.debounce((e) => {
        this.updateAll();
      }, this.debounceTimeResize), false);
    }

    /**
     * updateAll
     */
    updateAll() {
      const data = this.getData();
      if (!data || !data.elems) { return; }
      _.forEach(data.elems, (elem) => {
        this.update(elem, data);
      });
    }

    /**
     * update
     *
     * @param {object} elem
     * @param {object} data
     */
    update(elem, data = this.getData()) {
      if (!data) { return; }
      if (elem.classList.contains(this.setClassName)) { return; }
      if (!this.isConditions(elem)) { return; }

      const target = getElemRect(elem);
      const thresholdDiff = data.window.height * this.threshold;

      // thresholdDiff分の余白がない場合
      if (((target.bottom + thresholdDiff) >= data.bodyHeight &&
        data.window.bottom >= data.bodyHeight) ||
        ((target.top - thresholdDiff) <= 0 &&
          data.window.top <= 0)
      ) {
        this.set(elem);
      }

      // 余白含めて画面内
      if (target.bottom >= data.window.top + thresholdDiff &&
          data.window.bottom - thresholdDiff >= target.top) {
        this.set(elem);
      }
    }

    /**
     * getData
     *
     * @returns {object}
     */
    getData() {
      const baseElem = doc.querySelector(this.baseElem);
      if (!baseElem) { return; }
      const elems =  baseElem.querySelectorAll([
        `[${this.dataAttr.image}]`,
        `[${this.dataAttr.background}]`
      ].join(','));

      return {
        elems,
        window: getWindowRect(),
        bodyHeight: parseInt(doc.body.getBoundingClientRect().height)
      };
    }

    /**
     * set
     *
     * @param {object} elem
     */
    set(elem) {
      if (elem.classList.contains(this.setClassName)) { return; }
      if (elem.getAttribute(this.dataAttr.image)) {
        elem.src = elem.getAttribute(this.dataAttr.image);
      }
      if (elem.getAttribute(this.dataAttr.background)) {
        elem.style.backgroundImage = `url(${elem.getAttribute(this.dataAttr.background)})`;
      }
      elem.classList.add(this.setClassName);

      if (elem.getAttribute(this.dataAttr.image)) {
        elem.removeAttribute(this.dataAttr.image);
      }
      if (elem.getAttribute(this.dataAttr.background)) {
        elem.removeAttribute(this.dataAttr.background);
      }
    }

    /**
     * setConditions
     *
     * @param {function} func
     */
    setConditions(func) {
      if (func && _.isFunction(func)) {
        this.isConditions = func;
      }
    }

    /**
     * initializeConditions
     */
    initializeConditions() {
      this.isConditions = (elem) => {
        return true;
      };
    }

    /**
     * clearConditions
     */
    clearConditions() {
      this.initializeConditions();
    }

  };

})(window, document);

