export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * LazyImage
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
      this.dataAttr = `data-lazy-image`;

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
      if (elem.classList.contains(this.setClassName)) { return; }
      if (!this.isConditions(elem)) { return; }

      const target = this.getTargetData(elem);
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
      return {
        elems: baseElem.querySelectorAll(`[${this.dataAttr}]`),
        window: this.getWindowData(),
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
      elem.src = elem.getAttribute(this.dataAttr);
      elem.classList.add(this.setClassName);
      elem.removeAttribute(this.dataAttr);
    }

    /**
     * getTargetData
     *
     * @param {object} elem target
     * @returns {object}
     */
    getTargetData(elem) {
      const rect = elem.getBoundingClientRect();
      const top = this.getOffsetPos(elem).y
        || rect.y + this.getWindowData().top
        || 0;
      const height = rect.height;

      return {
        top,
        height,
        bottom: (top + height)
      };
    }

    /**
     * getWindowData
     *
     * @returns {object}
     */
    getWindowData() {
      const top = win.pageYOffset;
      const height = win.innerHeight;

      return {
        top,
        height,
        bottom: (top + height)
      };
    }

    /**
     * getOffsetPos
     *
     * @param {object} elem element
     * @returns {object} position x, y
     */
    getOffsetPos(elem) {
      let pos = {x: 0, y: 0};
      while(elem) {
        pos.y += elem.offsetTop || 0;
        pos.x += elem.offsetLeft || 0;
        elem = elem.offsetParent;
      }
      return pos;
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

