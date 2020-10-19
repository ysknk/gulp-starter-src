import { kebabToCamel } from '../../utilities/'
import barba from './index';

// import topPage from '../../../_pages/top';
// import testPage from '../../../_pages/test';

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
              afterOnce() {},

              before() {},
              beforeLeave() {},
              leave(data) {
                // const done = this.async();
                // leaveFunction(done, data);
              },
              // NOTE: call destroy
              afterLeave(data) {
                const page = that.getPageName(data.current.namespace);
                if (!page) { return; }
                page.destroy(data);
              },

              beforeEnter(data) {
                barbaThis.replaceHeadTags(data.next);

                const page = that.getPageName(data.next.namespace);
                if (!page) { return; }
                barbaThis.sendAnalytics();

                page.initialize(data);
                page.created(data);
              },
              enter() {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              },
              afterEnter() {},
              // NOTE: call mounted
              after(data) {
                const page = that.getPageName(data.next.namespace);
                if (!page) { return; }
                page.mounted(data);
              }
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
      return FN[`${kebabToCamel(namespace)}Page`]
    }

  };

})(window, document);

