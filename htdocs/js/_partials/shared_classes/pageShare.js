export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * PageShare
   * <a href="javascript:void(0)" data-share-sns="[twitter|facebook|line]" data-share-target="_blank">link</a>
   */
  return class PageShare {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof PageShare)) {
        return new PageShare(opts_);
      }
      this.dataAttr = {
        share: 'data-share-sns',
        url: 'data-share-url',
        title: 'data-share-title',
        description: 'data-share-description',
        target: 'data-share-target',
        hashtags: 'data-share-hashtags'
      };
      this.width = 650;
      this.height = 470;

      this.twitterShareUrl = 'https://twitter.com/share?';
      this.facebookShareUrl = 'https://www.facebook.com/sharer/sharer.php?';
      this.LineShareUrl = 'https://social-plugins.line.me/lineit/share?';

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        let elem = e.target.closest(`[${this.dataAttr.share}]`);// delegate
        if (e.target === doc || !elem) return;

        this.open(elem);
      }, false);
    }

    /**
     * open
     *
     * @param {object} elem
     */
    open(elem) {
      const og = this.getMeta(elem);
      const attr = elem.getAttribute(this.dataAttr.share);
      const target = elem.getAttribute(this.dataAttr.target);

      const windowName = `${attr}_window`;

      const left = Number((win.screen.width - this.width) / 2);
      const top = Number((win.screen.height - this.height) / 2);

      const separator = ',';
      const option = [
        `width=${this.width}`,
        `height=${this.height}`,
        'personalbar=0',
        'toolbar=0',
        'scrollbars=1',
        'sizable=1',
        `left=${left}`,
        `top=${top}`
      ].join(separator);

      let url = ``;

      switch (attr) {
        case 'twitter':
          url = `${this.twitterShareUrl}url=${og.enc.url}&text=${og.enc.title}${og.enc.hashtags ? '&hashtags=' + og.enc.hashtags : ''}`;
          break;
        case 'facebook':
          url = `${this.facebookShareUrl}u=${og.enc.url}`;
          break;
        case 'line':
          url = `${this.LineShareUrl}url=${og.enc.url}`;
          break;
        default:
          break;
      }

      if (url) {
        this.openUrl(url, target, windowName, option);
      }
    }

    /**
     * openUrl
     *
     * @param {string} url
     * @param {string} target
     * @param {string} windowName
     * @param {string} option
     */
    openUrl(url, target, windowName, option) {
      if (target === '_blank') {
        window.open(url, windowName, option);
      } else {
        location.href = url;
      }
    }

    /**
     * getMeta
     *
     * @param {object} elem has data tags element
     * @returns {object} meta data
     */
    getMeta(elem) {
      let url = this.getMetaOg(elem, 'url');
      let title = this.getMetaOg(elem, 'title');
      let description = this.getMetaOg(elem, 'description');
      let hashtags = this.getMetaOg(elem, 'hashtags');

      return {
        url,
        title,
        description,
        hashtags,

        enc: {
          url: encodeURIComponent(url),
          title: encodeURIComponent(title),
          description: encodeURIComponent(description),
          hashtags: encodeURIComponent(hashtags)
        }
      };
    }

    /**
     * getMetaOg
     *
     * @param {object} elem
     * @param {string} property og:***
     * @returns {string} content
     */
    getMetaOg(elem, property) {
      let ogTag = doc.querySelector(`meta[property="og:${property}"]`) || '';
      let content = elem.getAttribute(this.dataAttr[property]) ||
        (ogTag ? ogTag.getAttribute('content') : '');

      return content;
    }

  };

})(window, document);

