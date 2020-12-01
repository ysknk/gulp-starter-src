import { parseJSON, isSupportedHistoryAPI } from '../utilities/'

export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Tab
   */
  return class Tab {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Tab)) {
        return new Tab(opts_);
      }

      this.baseElem = 'body';

      this.dataAttr = 'data-tab';
      this.activeClassName = 'is-active';

      this.isToggleClose = false;

      this.isActive = false;

      this.initialTab = 0;
      this.historyAPI = false;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      this.elemSelector = [
        this.baseElem,
        `[${this.dataAttr}]`
      ].join(' ');

      if (!this.isActive) {
        this.setIsActive(false);
      }

      this.setActiveTab();
      this.onpopstate();

      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        const elem = e.target.closest(this.elemSelector);

        if (e.target === doc || !elem) return;

        const data = parseJSON(elem.getAttribute(this.dataAttr));

        this.historyPush(e, elem);

        if (this.hasActive(elem)) {
          if (this.isToggleClose) {
            // @current close
            this.onHide(elem, data);
          }
          return;
        } else {
          this.open(elem, data);
        }
      });
    }

    /**
     * isHistoryAPI
     *
     * @returns {boolean}
     */
    isHistoryAPI() {
      return (!isSupportedHistoryAPI || !this.historyAPI)
    }

    /**
     * historyPush
     *
     * @param {object} e event
     * @param {object} elem btn
     */
    historyPush(e, elem) {
      if (this.isHistoryAPI()) { return; }
      e.preventDefault();

      if (elem && elem.search) {
        const stateObject = {
          search: elem.search
        };
        history.pushState(stateObject, '', elem.search);
      }
    }

    /**
     * onpopstate
     */
    onpopstate() {
      if (this.isHistoryAPI()) { return; }
      win.addEventListener('popstate', (e) => {
        this.setActiveTab();
      });
    }

    /**
     * setActiveTab
     */
    setActiveTab() {
      const elems = doc.querySelectorAll(this.elemSelector);
      const locationSearch = location.search;

      let isMatch = false;

      _.forEach(elems, (elem) => {
        const search = elem.search;

        if (search) {
          if (locationSearch.match(search.slice(1))) {
            elem.classList.add(this.activeClassName);
            isMatch = true;
          } else {
            elem.classList.remove(this.activeClassName);
          }
        }
      });

      if (!isMatch) {
        if (elems && elems[this.initialTab]) {
          elems[this.initialTab].classList.add(this.activeClassName);
        }
      }
      this.setActive();
    }

    /**
     * setActive
     */
    setActive() {
      const elems = doc.querySelectorAll([
        this.baseElem,
        `[${this.dataAttr}]`
      ].join(' '));

      let data;

      // set state
      _.forEach(elems, (elem) => {
        if (this.hasActive(elem)) {
          data = parseJSON(elem.getAttribute(this.dataAttr));
          this.open(elem, data);
        }
      });
    }

    /**
     * open
     *
     * @param {object} elem btn
     * @param {object} data json btn,category,group
     */
    open(elem, data) {
      if (this.getIsActive()) return;
      this.setIsActive(true);

      const groups = doc.querySelectorAll([
        this.baseElem,
        data.group
      ].join(' '));
      if (!groups.length) return;

      // set btn class
      const btns = doc.querySelectorAll([
        this.baseElem,
        data.btn
      ].join(' '));
      if (!btns.length) return;

      _.forEach(btns, (btn) => {
        this.setButtonState(elem, btn);
      });

      // not current close
      const name = data.category.replace(/^(\.|\#)/, '');
      let hideElems = [];
      let current = null;

      _.forEach(groups, (group) => {
        if (group.classList.contains(name)) {
          current = group;
        } else {
          hideElems.push(group);
        }
      });

      // hide
      if (hideElems.length) {
        _.forEach(hideElems, (hideElem) => {
          hideElem.classList.remove(this.activeClassName);
          this.onHid(hideElem, data);
        });
        this.onHide(hideElems, data);
      }

      // show
      current.classList.add(this.activeClassName);
      this.onShow(current, data);
      this.onShowed(current, data);

      this.setIsActive(false);
    }

    /**
     * setButtonState
     *
     * @param {object} elem
     * @param {object} btn
     */
    setButtonState(elem, btn) {
      if (elem === btn) {
        btn.classList.add(this.activeClassName);
      } else {
        btn.classList.remove(this.activeClassName);
      }
    }

    /**
     * hasActive
     *
     * @param {object} elem element
     * @returns {boolean}
     */
    hasActive(elem) {
      return elem.classList.contains(this.activeClassName);
    }

    /**
     * onShow
     *
     * @param {object} elem group or elem
     * @param {object} data json
     */
    onShow(elem, data) {}

    /**
     * onShowed
     *
     * @param {object} elem group or elem
     * @param {object} data json
     */
    onShowed(elem, data) {}

    /**
     * onHide
     *
     * @param {object} elem group or elem
     * @param {object} data json
     */
    onHide(elem, data) {}

    /**
     * onHid
     *
     * @param {object} elem group or elem
     * @param {object} data json
     */
    onHid(elem, data) {}

    /**
     * setIsActive
     *
     * @param {boolean} bool
     */
    setIsActive(bool) {
      this.isActive = bool;
    }

    /**
     * getIsActive
     *
     * @returns {boolean}
     */
    getIsActive() {
      return this.isActive;
    }

  };

})(window, document);

