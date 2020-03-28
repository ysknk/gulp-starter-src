export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Menu
   * <div class="js-menu">
   *   <div class="js-menu__button"><a href="javascript:void(0)">button</a></div>
   *   <div class="js-menu__content">
   *     <div class="js-menu__wrapper">content</div> // overflow auto
   *   </div>
   * </div>
   */
  return class Menu {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Menu)) {
        return new Menu(opts_);
      }

      this.baseElemSelector = '#wrapper';
      this.elemSelector = `.js-menu`;
      this.buttonElemSelector = `${this.elemSelector}__button`;
      this.contentElemSelector = `${this.elemSelector}__content`;
      this.contentWrapperElemSelector = `${this.elemSelector}__wrapper`;
      this.closeElemSelector = `${this.elemSelector}__close`;

      this.openClassName = `is-menu-open`;

      this.isOpen = false;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      let button = [
        this.baseElem,
        this.buttonElemSelector
      ].join(' ');

      let close = [
        this.baseElem,
        this.closeElemSelector
      ].join(' ');

      let contentElem = this.getElem(`contentElem`);
      if (contentElem) {
        contentElem.style.opacity = 0
      }

      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        let elem = e.target.closest(button);// delegate
        let closeElem = e.target.closest(close);// delegate

        let isElemUndefined = (!elem && !closeElem);

        if (e.target === doc || isElemUndefined) return;

        if (closeElem) {
          this[`close`]();
        } else if(elem) {
          this[this.isOpen ? `close` : `open`]();
        }
      }, false);

    }

    /**
     * open
     */
    open() {
      if (this.isOpen) return;
      this.isOpen = true;

      let baseElem = this.getElem(`baseElem`);
      baseElem.classList.add(this.openClassName);

      let contentElem = this.getElem(`contentElem`);
      if (contentElem) {
        FN.anime({
          targets: contentElem,
          opacity: 1,
          duration: this.duration,
          easing: this.easing
        });
      }

      let contentWrapper = this.getElem(`contentWrapperElem`);
      if (contentWrapper) {
        contentWrapper.scrollTo(0, 0);
      }
    }

    /**
     * close
     */
    close() {
      if (!this.isOpen) return;
      this.isOpen = false;

      let contentElem = this.getElem(`contentElem`);
      if (contentElem) {
        FN.anime({
          targets: contentElem,
          opacity: 0,
          duration: this.duration,
          easing: this.easing
        });
      }

      let baseElem = this.getElem(`baseElem`);
      baseElem.classList.remove(this.openClassName);
    }

    /**
     * getElem
     *
     * @returns {object}
     */
    getElem(name) {
      if (!this[name]) {
        this[name] = doc.querySelector(this[`${name}Selector`]);
      }
      return this[name];
    }
  };

})(window, document);

