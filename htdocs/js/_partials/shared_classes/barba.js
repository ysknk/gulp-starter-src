import barba from '@barba/core';
import barbaCss from '@barba/css';
import barbaPrefetch from '@barba/prefetch';

export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Barba
   */
  return class Barba {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Barba)) {
        return new Barba(opts_);
      }

      const that = this;
      this.options = (that) => {
        return {
          debug: false,

          // NOTE: consoleに情報を表示しない
          logLevel: 'off',

          // NOTE: アンカーリンクを有効化
          prevent: ({el}) => {
            return el.getAttribute('href').slice(0, 1) === '#';
          },

          // NOTE: https://barba.js.org/docs/advanced/views/
          views: [],

          // NOTE: https://barba.js.org/docs/advanced/transitions/
          transitions: []
        }
      };

      this.gtagID = ``;

      this.isCancelLinkToSamePage = true;
      this.linkElemSelector = `a[href]`;

      this.useBarbaCss = false;
      this.useBarbaPrefetch = false;

      // _.isObject(opts_) && _.extend(this, opts_);
      _.isObject(opts_) && _.merge(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      const that = this;

      if (this.useBarbaCss) {
        barba.use(barbaCss);
      }
      if (this.useBarbaPrefetch) {
        barba.use(barbaPrefetch);
      }

      barba.init(this.options(that));

      // NOTE: 現在のページと同一のページへのリンクをクリック時にイベントキャンセル
      if (this.isCancelLinkToSamePage) {
        this.cancelLinkToSamePage();
      }
    }

    /**
     * cancelLinkToSamePage
     */
    cancelLinkToSamePage () {
      const cancelEvent = (elem, e) => {
        if (elem.href === window.location.href) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      };

      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        const elem = e.target.closest(this.linkElemSelector);// delegate
        if (e.target === doc || !elem) return;
        cancelEvent(elem, e);
      }, false);
    }

    /**
     * sendAnalytics
     */
    sendAnalytics() {
      if (!this.gtagID) return;

      const gtag = window.gtag;// || [];
      if (!gtag) return;
      const data = {
        'page_title' : doc.title,
        'page_path': location.pathname
      };
      gtag('config', this.gtagID, data);
    }

    /**
     * replaceHeadTags
     *
     * @param {object} target
     */
    replaceHeadTags(target) {
      const head = document.head;
      const targetHead = target.html.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0];
      const newPageHead = document.createElement('head');
      newPageHead.innerHTML = targetHead;
      const removeHeadTags = [
        `meta[name='keywords']`,
        `meta[name='description']`,
        `meta[property^='fb']`,
        `meta[property^='og']`,
        `meta[name^='twitter']`,
        `meta[name='robots']`,
        `meta[itemprop]`,
        `link[itemprop]`,
        `link[rel='prev']`,
        `link[rel='next']`,
        `link[rel='canonical']`,
      ].join(',');
      const headTags = [...head.querySelectorAll(removeHeadTags)];
      headTags.forEach((item) => {
        head.removeChild(item);
      });
      const newHeadTags = [...newPageHead.querySelectorAll(removeHeadTags)];
      newHeadTags.forEach((item) => {
        head.appendChild(item);
      });
    }

  };

})(window, document);

