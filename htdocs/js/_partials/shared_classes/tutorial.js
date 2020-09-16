export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Tutorial
   * <div data-tutorial="1">1</div>
   * <div data-tutorial="2">2</div>
   * <div data-tutorial="3">3</div>
   *
   * FN.tutorial.setItems([
   *   {id: '1', delay: 1000},
   *   {id: '2', delay: 3000},
   *   {id: '3', delay: 5000, duration: 2000}
   * ]);
   * FN.tutorial.initialize();
   * FN.tutorial.start({
   *   endAll: () => {}
   * });
   */
  return class Tutorial {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Tutorial)) {
        return new Tutorial(opts_);
      }

      this.dataAttr = 'data-tutorial';

      this.items = [];

      this.useStorage = true;

      this.animationStartClassName = 'is-animation-start';
      this.animationEndClassName = 'is-animation-end';
      this.tutorialCompleteClassName = 'is-tutorial-complete';

      this.endDelay = 1000;

      this.storageName = 'tutorial';

      _.isObject(opts_) && _.extend(this, opts_);

      this.checkComplete();
      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      doc.querySelector('html').classList.remove(this.tutorialCompleteClassName);
      this.clearAll();
    }

    /**
     * clearAll
     */
    clearAll() {
      const items = this.getFormatItems();
      _.forEach(items, (item) => {
        item.elem.classList.remove(this.animationStartClassName);
        item.elem.classList.remove(this.animationEndClassName);
      });
    }

    /**
     * isStorageTime
     */
    isStorageTime() {
      if (!window.localStorage) {
        return false;
      }
      return window.localStorage.getItem(this.storageName);
    }

    /**
     * setStorageTime
     */
    setStorageTime() {
      if (!window.localStorage) {
        return false;
      }
      window.localStorage[this.storageName] = new Date().getTime();
    }

    /**
     * removeStorage
     */
    removeStorage() {
      if (!window.localStorage) {
        return false;
      }
      window.localStorage.removeItem(this.storageName);
    }

    /**
     * checkComplete
     */
    checkComplete() {
      if (this.isDone()) {
        this.onComplete();
      }
    }

    /**
     * isDone
     *
     * @returns {boolean}
     */
    isDone() {
      return this.isStorageTime() ? true : false;
    }

    /**
     * onComplete
     */
    onComplete() {
      doc.querySelector('html').classList.add(this.tutorialCompleteClassName);
    }

    /**
     * start
     *
     * @param {object} options
     */
    start(options) {
      const endAll = () => {
        options && options.endAll && options.endAll();
      };
      const endComplete = () => {
        options && options.endComplete && options.endComplete();
      };
      const endFirst = () => {
        options && options.endFirst && options.endFirst();
      };

      if (this.useStorage) {
        if (this.isDone()) {
          endAll();
          endComplete();
          this.onComplete();
          return;
        } else {
          this.setStorageTime();
        }
      }

      const items = this.getFormatItems();
      let endCount = 0;

      _.forEach(items, (buffer) => {
        ((item) => {
          // NOTE: delay
          setTimeout(() => {
            item.elem.classList.add(this.animationStartClassName);
            // NOTE: duration
            setTimeout(() => {
              endCount++;
              if (endCount >= 0) {
                endFirst();
              }
              if (endCount >= items.length) {
                this.endAll();
                // NOTE: end
                endAll();
                setTimeout(() => {
                  endComplete();
                  this.onComplete();
                }, this.endDelay || 0);
              }
            }, item.options.duration || 0);
          }, item.options.delay || 0);
        })(buffer);
      });
    }

    /**
     * endAll
     */
    endAll() {
      const items = this.getFormatItems();
      _.forEach(items, (item) => {
        item.elem.classList.add(this.animationEndClassName);
      });
    }

    /**
     * getFormatItems
     *
     * @returns {object}
     */
    getFormatItems () {
      if (this.formatItems && this.formatItems.length > 0) {
        return this.formatItems;
      }

      this.formatItems = [];
      _.forEach(this.items, (item) => {
        const elem = doc.querySelector(`[${this.dataAttr}='${item.id}']`);
        elem && this.formatItems.push({
          elem,
          options: item
        });
      });
      return this.formatItems;
    }

    /**
     * setItems
     *
     * @param {object} items
     */
    setItems(items) {
      this.items = items;
    }

  };

})(window, document);

