export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * FixedScrollSlide
   */
  return class FixedScrollSlide {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if(!(this instanceof FixedScrollSlide)) {
        return new FixedScrollSlide(opts_);
      }

      this.dataAttr = `data-fixed-scroll-slide`;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * initialize
     */
    update() {
      let scrollPosX = win.pageXOffset || 0;
      let elems = doc.querySelectorAll(`[${this.dataAttr}]`);

      _.forEach(elems, (elem) => {
        if(0 >= scrollPosX) {
          elem.style.width = ``;
          elem.style.left = ``;
          return;
        }
        elem.style.width = `${doc.body.clientWidth}px`;
        elem.style.left = `-${scrollPosX}px`;
      });
    }

  };

})(window, document);
