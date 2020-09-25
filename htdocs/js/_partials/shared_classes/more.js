export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * More
   * <div id="items">
   *   <ul>
   *     <li>1</li>
   *     <li>2</li>
   *   </ul>
   *   <a href="javascript:void(0)" data-more-elems="#items li">more</a>
   * </div>
   */
  return class More {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof More)) {
        return new More(opts_);
      }

      this.dataAttr = {
        initcount: `data-more-initcount`,
        count: `data-more-count`,
        elems: `data-more-elems`,

        labelShow: `data-more-label-show`,
        labelHide: `data-more-label-hide`
      };

      this.wrapSelector = ``;

      this.showClassName = `is-show`;
      this.initClassName = `is-init`;

      this.hideClassName = `is-hide`;

      this.notMoreClassName = `not-more`;

      this.isLoading = false;

      this.cacheItemElems = false;

      this.defaultLabel = `もっと見る`;

      this.initcount = 5;
      this.count = 5;
      this.page = 0;

      this.isInit = true;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      this.listInitialize();

      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        const elem = e.target.closest([// delegate
          `[${this.dataAttr.elems}]`
        ].join(' '));
        if (e.target === doc || !elem) return;

        if (this.isLoading) return;
        this.isLoading = true;

        if (this.isShow()) {
          this.showNextItems();
        } else {
          this.listInitialize();
          this.gotoTop();
        }

        this.isLoading = false;
      }, false);
    }

    /**
     * gotoTop
     */
    gotoTop() {
      const elem = this.getWrapElem();
      if (!elem) return;
      FN.scroll.goto(elem);
    }

    /**
     * listInitialize
     */
    listInitialize() {
      this.setIsInit(true);

      const baseElem = this.getElem();
      if (!baseElem) return;

      const text = this.getLabel(this.dataAttr.labelShow)
        || this.defaultLabel;
      if (text) {
        baseElem.classList.remove(this.hideClassName);
        baseElem.classList.add(this.showClassName);
        this.changeButtonLabel(text, this.dataAttr.labelShow);
      }

      this.setPage(0);

      this.initAllItem();
      this.showNextItems();
    }

    /**
     * initAllItem
     */
    initAllItem() {
      const elems = this.getItemElems();
      _.forEach(elems, (elem) => {
        this.initItem(elem);
      });
    }

    /**
     * initItem
     *
     * @param {object} elem
     */
    initItem(elem) {
      if (!elem) return;
      elem.classList.add(this.initClassName);
      elem.classList.remove(this.showClassName);
    }

    /**
     * showItem
     *
     * @param {object} elem
     */
    showItem(elem) {
      elem.classList.add(this.showClassName);
    }

    /**
     * showItems
     *
     * @param {number} page
     */
    showItems(page) {
      const buttonElem = this.getElem();
      if (!buttonElem) return;

      const isInit = this.getIsInit();

      const elems = this.getItemElems();
      const count = this.getCalculateCount(page);

      if (this.getInitCount() >= elems.length) {
        this.onError(() => {
          let wrapElem = this.getWrapElem();
          if (!wrapElem) return;
          wrapElem.classList.add(this.notMoreClassName);
        });
      }

      // initcount と countが合わない場合
      if (!isInit && this.getInitCount() != this.getCount()) {
        const diffcount = (this.getInitCount() - this.getCount()) + this.getInitCount();
        count.start = count.start - this.getInitCount() + diffcount;
        count.limit = count.limit - this.getInitCount() + diffcount;
      }

      for(let i = count.start; count.limit > i; i++) {
        const elem = elems[i];
        const nextElem = elems[i + 1];

        if (!elem) {
          this.onListEnd();
          break;
        }

        this.showItem(elem);

        if (!nextElem) {
          this.onListEnd();
          break;
        }
      }
    }

    /**
     * showNextItems
     */
    showNextItems() {
      this.incrementPage();
      this.showItems(this.getPage());
    }

    /**
     * getCountNumber
     *
     * @returns {number}
     */
    getCountNumber() {
      let count = this.getCount();

      if (this.getIsInit()) {
        this.setIsInit(false);
        count = this.getInitCount();
      }

      return count;
    }

    /**
     * getCount
     *
     * @returns {number}
     */
    getCount() {
      const buttonElem = this.getElem();
      const elemCount = buttonElem
        && buttonElem.getAttribute(this.dataAttr.count);
      return elemCount || this.count;
    }

    /**
     * getInitCount
     *
     * @returns {number}
     */
    getInitCount() {
      const buttonElem = this.getElem();
      const elemCount = buttonElem
        && buttonElem.getAttribute(this.dataAttr.initcount);
      return elemCount || this.initcount;
    }

    /**
     * getCalculateCount
     *
     * @param {number} page
     * @returns {object}
     */
    getCalculateCount(page) {
      const count = this.getCountNumber();
      const nowPage = page || this.getPage();
      return {
        start: (nowPage - 1) * count,
        limit: nowPage * count
      };
    }

    /**
     * removeButton
     */
    removeButton() {
      const buttonElem = this.getElem();
      if (!buttonElem) return;
      buttonElem.parentNode.removeChild(buttonElem);
    }

    /**
     * changeButtonLabel
     *
     * @param {string} label
     * @param {string} data
     */
    changeButtonLabel(label, data) {
      const elem = this.getLabelElem(data);
      if (!elem) return;
      elem.innerHTML = label;
    }

    /**
     * getElem
     *
     * @returns {object}
     */
    getElem() {
      return doc.querySelector(`[${this.dataAttr.elems}]`);
    }

    /**
     * getWrapElem
     *
     * @returns {object}
     */
    getWrapElem() {
      return this.wrapSelector
        ? doc.querySelector(this.wrapSelector)
        : ``;
    }

    /**
     * getLabel
     *
     * @returns {string}
     */
    getLabel(data) {
      let elem = this.getLabelElem(data);
      if (!elem) return '';
      return elem.getAttribute(data) || '';
    }

    /**
     * getLabelElem
     *
     * @returns {object}
     */
    getLabelElem(data) {
      if (!this.getElem()) return;
      return this.getElem().querySelector(`[${data || this.dataAttr.labelShow}]`);
    }

    /**
     * getItemElems
     *
     * @returns {object}
     */
    getItemElems() {
      if (!this.itemElemsSelector) {
        let elem = this.getElem();
        this.itemElemsSelector = elem.getAttribute(this.dataAttr.elems);
      }
      if (!this.cacheItemElems || !this.itemElems) {
        this.itemElems = doc.querySelectorAll(this.itemElemsSelector);
      }
      return this.itemElems;
    }

    /**
     * onError
     */
    onError(cb) {
      this.removeButton();
      _.isFunction(cb) && cb();
    }

    /**
     * onListEnd
     */
    onListEnd(cb) {
      let elem = this.getElem();
      let text = this.getLabel(this.dataAttr.labelHide);
      if (text) {
        elem.classList.remove(this.showClassName);
        elem.classList.add(this.hideClassName);
        this.changeButtonLabel(text, this.dataAttr.labelHide);
        _.isFunction(cb) && cb();
        return;
      }

      this.removeButton();
      _.isFunction(cb) && cb();
    }

    /**
     * isShow
     *
     * @returns {boolean}
     */
    isShow() {
      let elem = this.getElem();
      return !elem.classList.contains(this.hideClassName);
    }

    /**
     * setPage
     *
     * @param {number} page
     */
    setPage(page) {
      this.page = page;
    }

    /**
     * getPage
     *
     * @returns {number}
     */
    getPage() {
      return this.page;
    }

    /**
     * setIsInit
     *
     * @param {boolean} bool
     */
    setIsInit(bool) {
      this.isInit = bool;
    }

    /**
     * getIsInit
     *
     * @returns {boolean}
     */
    getIsInit() {
      return this.isInit;
    }

    /**
     * incrementPage
     *
     * @returns {number}
     */
    incrementPage() {
      return this.page++;
    }

    /**
     * decrementPage
     *
     * @returns {number}
     */
    decrementPage() {
      return this.page--;
    }

  };

})(window, document);

