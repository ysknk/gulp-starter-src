export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * ageAuth
   */
  return class ageAuth {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof ageAuth)) {
        return new ageAuth(opts_);
      }

      this.wrapID = `age-auth`;
      this.elemSelector = this.wrapID;
      this.openClassName = `is-auth-open`;

      this.redirectURL = `/error/age.html`;

      this.htmlElem = doc.documentElement;
      this.siteAuth = this.htmlElem.getAttribute(`data-site-auth`) || ``;

      this.dataWrap = `site_data`
      this.dataType = `Cookie`;// localStorage || Cookie[default]
      this.dataName = `is_agree_age`;
      this.dataValue = true;
      this.dataExpires = 365;

      this.template = [
        `<div class="${this.elemSelector}">`,
          `<div class="${this.elemSelector}__inner">`,
            `<div class="${this.elemSelector}__lead">`,
              `<p class="${this.elemSelector}__text">年齢認証</p>`,
              `<p class="${this.elemSelector}__strong">あなたは20歳以上ですか？</p>`,
            `</div>`,
            `<ul class="${this.elemSelector}__buttons">`,
              `<li class="${this.elemSelector}__button ${this.elemSelector}__button--no">`,
                `<button onclick="javascript:${NS}.ageAuth.setConfirmNo()">いいえ</button>`,
              `</li>`,
              `<li class="${this.elemSelector}__button ${this.elemSelector}__button--yes">`,
                `<button onclick="javascript:${NS}.ageAuth.setConfirmYes()">はい</button>`,
              `</li>`,
            `</ul>`,
          `</div>`,
        `</div>`
      ].join('');

      this.isOpen = false;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      if (!this.siteAuth || !this.siteAuth.match(/^age$/i)) return;
      // エラーページでは認証しない
      if (location.href.match(this.getErrorPageUrl())) return;

      const elem = doc.getElementById(this.wrapID);
      if (elem) return;

      const isCheckAge = this.getLocalData(this.dataName);

      // 立ち上げ
      if (!isCheckAge) {
        this.openConfirm();
      }else{
        this.setAgeData();
      }
    }

    /**
     * openConfirm
     */
    openConfirm() {
      if (this.isOpen) return;
      this.isOpen = true;

      const node = doc.createElement(`div`);
      node.id = this.wrapID;
      node.innerHTML = this.template;

      doc.body.appendChild(node);
      doc.body.classList.add(this.openClassName);

      const event = (e) => {
        e.preventDefault();
      };
      node.removeEventListener('touchmove', event, false);
      node.addEventListener('touchmove', event, false);
    }

    /**
     * setConfirmYes
     */
    setConfirmYes() {
      const elem = doc.querySelector(`#${this.wrapID}`);
      elem.parentNode.removeChild(elem);
      doc.body.classList.remove(this.openClassName);

      this.setAgeData();
    }

    /**
     * setConfirmNo
     */
    setConfirmNo() {
      const url = this.getErrorPageUrl();
      doc.body.classList.remove(this.openClassName);
      location.replace(url);
    }

    /**
     * getErrorPageUrl
     *
     * @returns {string}
     */
    getErrorPageUrl() {
      return this.redirectURL;
    }

    /**
     * getLocalData
     *
     * @param {string} name
     * @returns {string}
     */
    getLocalData(name) {
      if (this.dataType.match(/^localStorage$/i)) {
        if (!localStorage) return '';
        const data = localStorage.getItem(this.dataWrap);
        return data && JSON.parse(data)[name] || '';
      } else {
        return FN.cookies.get(name) || '';
      }
    }

    /**
     * setLocalData
     *
     * @param {string} name
     * @param {string} value
     * @param {object} options
     */
    setLocalData(name, value, options) {
      if (this.dataType.match(/^localStorage$/i)) {
        if (!localStorage) return;

        const isData = this.getLocalData(this.dataWrap);
        if (isData) return;

        try {
          localStorage.setItem(this.dataWrap, `{"${name}": ${value}}`);
        } catch(e) {
          console.log(e);
        }
      } else {
        FN.cookies.set(name, value, options);
      }
    }

    /**
     * setAgeData
     */
    setAgeData() {
      this.setLocalData(this.dataName, this.dataValue, {
        expires: this.dataExpires
      });
    }

  };

})(window, document);

