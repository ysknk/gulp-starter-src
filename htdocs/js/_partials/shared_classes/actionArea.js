import { isNumber, parseJSON, getWindowRect, getElemRect } from '../utilities/'

export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * ActionArea.
   * <div data-action-area='{"bottom": "#footer"}'>hoge</div>
   */
  return class ActionArea {

    /**
     * constructor.
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof ActionArea)) {
        return new ActionArea(opts_);
      }

      this.dataAttr = `data-action-area`;
      this.options = {
        top: 0,
        bottom: 0
      };
      this.actionClassName = `is-action`;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize.
     */
    initialize() {
      this.updateAll();
    }

    /**
     * updateAll.
     */
    updateAll() {
      const elems = doc.querySelectorAll(`[${this.dataAttr}]`);
      _.forEach(elems, (elem) => {
        this.update(elem);
      });
    }

    /**
     * update.
     *
     * @param {object} elem
     */
    update(elem) {
      const windowRect = getWindowRect();
      const top = windowRect.top;
      const bottom = windowRect.bottom;

      const attr = elem.getAttribute(this.dataAttr)
      let data = parseJSON(attr);
      data = _.merge({}, this.options, data);

      data = {
        top: this.getValue(data.top),
        bottom: this.getValue(data.bottom)
      };

      if (top >= data.top && bottom <= data.bottom) {
        elem.classList.add(this.actionClassName);
      } else {
        elem.classList.remove(this.actionClassName);
      }
    }

    /**
     * getValue.
     *
     * @param {number|string} val scroll value or elem selector
     * @param {string} pos top or bottom
     */
    getValue(val, pos = `top`) {
      return isNumber(val)
        ? val
        : (() => {
          const elem = doc.querySelector(val);
          return elem ? getElemRect(elem)[pos] : 0;
        })()
    }
  };

})(window, document);

