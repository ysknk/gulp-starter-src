import { getURLQuery } from '../utilities/'

export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * inheritParameter
   */
  return class inheritParameter {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof inheritParameter)) {
        return new inheritParameter(opts_);
      }

      this.baseElem = 'body';

      this.elem = 'a';
      this.queryNames = [];

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      if (!this.queryNames.length) return;

      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        const elem = e.target.closest([// delegate
          this.baseElem,
          this.elem
        ].join(' '));
        if (e.target === doc || !elem) return;

        if (elem.href && !elem.href.match(/(javascript\:|#)/i)) {
          e.preventDefault();
          this.updateHref(elem);
          this.gotoHref(elem);
        }
      });
    }

    /**
     * updateHref
     *
     * @param {object} elem a tag
     */
    updateHref(elem) {
      _.forEach(this.queryNames, (queryName) => {
        const value = getURLQuery(queryName);
        if (!value) return;

        const join = elem.href.match(/\?/) ? '&' : '?';
        const param = `${queryName}=${value}`;
        if (elem.href.match(param)) return;

        elem.href = `${elem.href}${join}${param}`;
      });
    }

    /**
     * gotoHref
     *
     * @param {object} elem a tag
     */
    gotoHref(elem) {
      if (!elem.target || elem.target.match(/^_self$/i)) {
        location.href = elem.href;
      } else {
        window.open(elem.href);
      }
    }

  };

})(window, document);

