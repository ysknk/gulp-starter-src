export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Analytics
   */
  return class Analytics {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Analytics)) {
        return new Analytics(opts_);
      }

      this.trackEventDefault = {
        // event: 'trackEventClick',
        // eventCategory: '',
        // eventAction: '',
        // eventLabel: ''
      };

      this.debug = false;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * sendEvent
     *
     * @param {object} { event, eventCategory, eventAction, eventLabel }
     * @returns {object || false} analitycs object || false
     */
    sendEvent(obj) {
      obj = _.extend(this.trackEventDefault, obj);
      const dataLayer = window.dataLayer || [];
      const data = obj;
      if (this.debug) {
        console.log(data);
        return false;
      }
      return dataLayer.push(data);
    }

  };

})(window, document);

