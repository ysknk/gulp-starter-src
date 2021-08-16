import { getOffset, getWindowRect } from '../utilities/'

export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * AnchorNav
   * <nav>
   *   <a href="#hoge" data-anchor-nav="#hoge">hoge</a>
   *   <a href="#huga" data-anchor-nav="#huga">huga</a>
   * </nav>
   * <div id="hoge" style="height: 1000px;">hoge</div>
   * <div id="huga" style="height: 1000px;">huga</div>
   */
  return class AnchorNav {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof AnchorNav)) {
        return new AnchorNav(opts_);
      }

      this.dataAttr = {
        nav: `data-anchor-nav`
      };

      this.currentClassName = 'is-current';
      this.minViewPercentage = 5;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * onIn
     *
     * @param {object} data
     */
    onIn(data) {}

    /**
     * onOut
     *
     * @param {object} data
     */
    onOut(data) {}

    /**
     * update
     */
    update() {
      const current = this.getCurrent();
      this.clearCurrent(current);
      this.setCurrent(current);
    }

    /**
     * setCurrent
     *
     * @param {object} current nav
     */
    setCurrent(current) {
      const elem = current && current.elem ? current.elem : '';
      if (elem && !elem.classList.contains(this.currentClassName)) {
        elem.classList.add(this.currentClassName);
        if (current.contentElem) {
          current.contentElem.classList.add(this.currentClassName);
        }
        this.onIn && this.onIn(current);
      }
    }

    /**
     * clearCurrent
     *
     * @param {object} current nav
     */
    clearCurrent(current) {
      const navs = this.getNavs();

      _.forEach(navs, (nav) => {
        const targetRect = this.getElemRect(nav);
        const navSelector = nav.getAttribute(this.dataAttr.nav);
        if (!current || (navSelector !== current.selector)) {
          if (nav.classList.contains(this.currentClassName)) {
            nav.classList.remove(this.currentClassName);
            if (targetRect.elem) {
              targetRect.elem.classList.remove(this.currentClassName);
            }
            this.onOut && this.onOut(current);
          }
        }
      });
    }

    /**
     * getCurrent
     *
     * @returns {object} current
     */
    getCurrent() {
      const navs = this.getNavs();
      const windowRect = getWindowRect();
      let currentNavs = [];

      _.forEach(navs, (nav, i) => {
        const targetData = this.getElemRect(nav);
        let visualRange = 0;

        // 画面内
        if (targetData.bottom >= windowRect.top &&
          windowRect.bottom >= targetData.top) {

          // 上部見切れ
          if (targetData.top <= windowRect.top) {
            visualRange = targetData.bottom - windowRect.top;
          // 下部見切れ
          } else if (targetData.bottom > windowRect.bottom) {
            visualRange = windowRect.bottom - targetData.top;
          // 見切れていない
          } else {
            visualRange = targetData.height;
          }

          currentNavs.push({
            num: i,
            selector: targetData.selector,
            elem: nav,
            contentElem: targetData.elem,
            visualRange
          });
        }
      });

      if (currentNavs && currentNavs.length) {
        currentNavs = _.orderBy(
          currentNavs,
          ['visualRange', 'num'],
          ['desc', 'desc']
        );
      }

      const targetObject = currentNavs[0];
      // ひとつだけの場合、コンテンツ自体の高さ1/${this.minViewPercentage}見えてるかどうか
      if (currentNavs.length <= 1 && targetObject) {
        const targetHeight = getWindowRect().height;
        if ((targetHeight / this.minViewPercentage) >= targetObject.visualRange) {
          targetObject.elem = null;
        }
      }

      return targetObject || null;
    }

    /**
     * getNavs
     *
     * @returns {object}
     */
    getNavs() {
      return doc.querySelectorAll(`[${this.dataAttr.nav}]`);
    }

    /**
     * getElemRect
     *
     * @param {object} elem target
     * @returns {object}
     */
    getElemRect(nav) {
      const selector = nav.getAttribute(this.dataAttr.nav);
      const elem = doc.querySelector(selector);

      const top = getOffset(elem).y;
      const height = elem ? elem.getBoundingClientRect().height : 0;

      return {
        selector,
        elem,
        top,
        height,
        bottom: (top + height)
      };
    }

  };

})(window, document);

