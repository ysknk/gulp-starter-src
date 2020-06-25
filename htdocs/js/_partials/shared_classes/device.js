export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Device
   */
  return class Device {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Device)) {
        return new Device(opts_);
      }

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * isSp
     *
     * @returns {boolean}
     */
    isSp() {
      return this.getDevice().type ? true : false;
    }

    /**
     * isPc
     *
     * @returns {boolean}
     */
    isPc() {
      return !this.isSp();
    }

    /**
     * isTab
     *
     * @returns {boolean}
     */
    isTab() {
      return this.isSp() &&
        this.getDevice().type.match(/^tablet$/i) ? true : false;
    }

    /**
     * getDevice
     *
     * @returns {object}
     */
    getDevice() {
      return FN.uaParser.getDevice();
    }

    /**
     * isTouch
     *
     * @returns {boolean}
     */
    isTouch() {
      if (navigator.msPointerEnabled) {
        return true;
      } else {
        if ('ontouchstart' in win) {
          return true;
        }
        if ('onmousedown' in win) {
          return false;
        }
      }
    }

  };

})(window, document);

