import barba from './barba';

// import topPage from '../../_pages/top';
// import testPage from '../../_pages/test';

export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  // page
  // FN.topPage = new topPage();
  // FN.testPage = new testPage();

  /**
   * BarbaConfig
   */
  return class BarbaConfig {
    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof BarbaConfig)) {
        return new BarbaConfig(opts_);
      }

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      this.barbaInitialize();
    }

    /**
     * barba
     */
    barbaInitialize() {
      const that = this;
      FN.barba = new barba({
        gtagID: ``,
        options: (barbaThis) => {
          return {
            transitions: [{
              name: 'transition',
              // NOTE: first visited
              beforeOnce(data) {
                const page = that.getPageName(data.next.namespace);
                if (!page) { return; }
                page.initialize(data);
                page.created(data);
              },
              once(data) {
                const page = that.getPageName(data.next.namespace);
                if (!page) { return; }
                page.mounted(data);
              },

              // NOTE: call destroy
              afterLeave(data) {
                const page = that.getPageName(data.current.namespace);
                if (!page) { return; }
                page.destroy(data);
              },

              // NOTE: call mounted
              afterEnter(data) {
                const page = that.getPageName(data.next.namespace);
                if (!page) { return; }
                page.mounted(data);
              },

              beforeLeave() {
              },

              leave(data) {
                // const done = this.async();
                // leaveFunction(done, data);
              },
              enter(data) {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              },
              beforeEnter(data) {
                barbaThis.replaceHeadTags(data.next);

                const page = that.getPageName(data.next.namespace);
                if (!page) { return; }
                barbaThis.sendAnalytics();

                page.initialize(data);
                page.created(data);
              },
            }]
          }
        }
      });
    }

    /**
     * getPageName
     *
     * @param {string} namespace
     * @returns {object} page class
     */
    getPageName(namespace) {
      const kebabToCamel = (str) => {
        str = str.charAt(0).toLowerCase() + str.slice(1);
        return str.replace(/[-_](.)/g, function(match, headStr) {
          return headStr.toUpperCase();
        });
      };
      return FN[`${kebabToCamel(namespace)}Page`]
    }

  };

})(window, document);

