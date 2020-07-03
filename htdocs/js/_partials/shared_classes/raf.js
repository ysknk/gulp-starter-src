export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * RAF
   * requestAnimationFrame
   * rad.add('key', func.bind(this))
   * rad.remove('key')
   */
  return class RAF {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof RAF)) {
        return new RAF(opts_);
      }

      _.isObject(opts_) && _.extend(this, opts_);

      this.renders = {};

      this.animation = null;

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
    }

    add(key, func) {
      if (this.renders[key]) { return; }
      this.renders[key] = func;
    }

    remove(key) {
      this.renders[key] = null;
      delete this.renders[key];
    }

    update() {
      // console.log('render', this.renders)
      this.animation = win.requestAnimationFrame(this.update.bind(this));
      _.forEach(this.renders, (render) => {
        if (!render) { return; }
        render();
      })
    }

    cancel() {
      win.cancelAnimationFrame(this.animation);
    }

  };

})(window, document);

