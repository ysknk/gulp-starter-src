import { parseJSON, getWindowRect, getElemRect } from '../utilities/'

export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Intersection
   * <div data-intersection='{"action": "intersection-fadeout", "threshold": 0.2, "callback": {"in": "onIn"}}'>hoge</div>
   */
  return class Intersection {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Intersection)) {
        return new Intersection(opts_);
      }

      this.dataAttr = 'data-intersection';

      this.options = {
        classname: {
          init: 'is-intersection-init',
          in: 'is-intersection-in',
          out: 'is-intersection-out'
        },
        action: 'intersection-fadein',
        isOnce: true,
        src: '',// image src
        threshold: 0.3,// 0 - 1.0 -> screen top - bottom
        callback: {// callback
          in: `onIn`,
          out: `onOut`,
        }
      };

      this.initializeStyle = `opacity: 0;`;

      _.isObject(opts_) && _.extend(this, opts_);

      this.setInitializeStyle();
      // this.initialize();
    }

    /**
     * onIn
     *
     * @param {object} elem
     * @param {object} data
     */
    onIn(elem, data) {}

    /**
     * onOut
     *
     * @param {object} elem
     * @param {object} data
     */
    onOut(elem, data) {}

    /**
     * setInitializeStyle
     */
    setInitializeStyle() {
      if (!this.initializeStyle) return;
      let headElem = doc.querySelector('head');
      let styleElem = doc.createElement('style');
      styleElem.innerHTML = `[${this.dataAttr}] {${this.initializeStyle}}`;
      headElem.appendChild(styleElem);
    }

    /**
     * initialize
     */
    initialize() {
      let elems = doc.querySelectorAll(`[${this.dataAttr}]`);
      _.forEach(elems, (elem, i) => {
        const attr = elem.getAttribute(this.dataAttr) || '';
        let data = parseJSON(attr);
        data = _.merge({}, this.options, data);
        if (elem.classList.contains(data.classname.init)) return;

        elem.classList.add(data.classname.init);
        elem.classList.add(data.action);
        elem.classList.remove(data.classname.in);
        elem.classList.remove(data.classname.out);
      });
    }

    /**
     * update
     */
    update() {
      const elems = doc.querySelectorAll(`[${this.dataAttr}]`);
      const windowRect = getWindowRect();
      const bodyHeight = parseInt(doc.body.getBoundingClientRect().height);

      _.forEach(elems, (elem, i) => {
        const attr = elem.getAttribute(this.dataAttr) || '';
        let data = parseJSON(attr);
        data = _.merge({}, this.options, data);

        if (data.isOnce
          && elem.classList.contains(data.classname.in)) return;

        const targetRect = getElemRect(elem);
        const thresholdDiff = windowRect.height * data.threshold;

        // thresholdDiff分の余白がない場合
        if (((targetRect.bottom + thresholdDiff) >= bodyHeight &&
          windowRect.bottom >= bodyHeight) ||
          ((targetRect.top - thresholdDiff) <= 0 &&
            windowRect.top <= 0)
        ) {
          this.setIn(elem, data);
        }

        // 余白含めて画面内
        if (targetRect.bottom >= windowRect.top + thresholdDiff &&
            windowRect.bottom - thresholdDiff >= targetRect.top) {
          this.setIn(elem, data);
        } else {
          // 一度きりの場合はoutクラスをつけない
          if (!data.isOnce) {
            this.setOut(elem, data);
          }
        }
      });
    }

    /**
     * setIn
     *
     * @param {object} elem
     * @param {object} data
     */
    setIn(elem, data) {
      if (!elem.classList.contains(data.classname.in)) {
        if (data.src) {
          elem.src = data.src;
        }
        elem.classList.remove(data.classname.out);
        elem.classList.add(data.classname.in);

        if (data.callback) {
          data.callback.in
            && _.isFunction(this[data.callback.in])
            && this[data.callback.in](elem, data);
        }
        if (data.isOnce) {
          elem.removeAttribute(this.dataAttr);
        }
      }
    }

    /**
     * setOut
     *
     * @param {object} elem
     * @param {object} data
     */
    setOut(elem, data) {
      if (elem.classList.contains(data.classname.in)) {
        elem.classList.remove(data.classname.in);
        elem.classList.add(data.classname.out);

        if (data.callback) {
          data.callback.out
            && _.isFunction(this[data.callback.out])
            && this[data.callback.out](elem, data);
        }
      }
    }

  };

})(window, document);

