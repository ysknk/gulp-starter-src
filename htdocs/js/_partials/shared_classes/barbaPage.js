export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * BarbaPage
   * <div id="wrapper" data-barba="wrapper" data-page=`${namespace}`>
   *   <div data-barba="container" data-barba-namespace=`${namespace}`>
   *   </div>
   * </div>
   */
  return class BarbaPage {
    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof BarbaPage)) {
        return new BarbaPage(opts_);
      }

      this.debug = false;
      this.pageName = `common`;
      this.dataAttr = {
        prevPage: 'data-prev-page',
        page: 'data-page'
      };

      this.cacheElems = {};

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     *
     * @param {object} data barba data
     */
    initialize(data) {
      if (this.debug) {
        console.log(`${this.pageName} initialize:`, data)
      }
      this.setPageAttribute(data);
    }

    /**
     * created
     *
     * @param {object} data barba data
     */
    created(data) {
      if (this.debug) {
        console.log(`${this.pageName} created:`, data)
      }
    }

    /**
     * mounted
     *
     * @param {object} data barba data
     */
    mounted(data) {
      if (this.debug) {
        console.log(`${this.pageName} mounted:`, data)
      }
      // this.addScrollbar();
    }

    /**
     * beforeDestroy
     *
     * @param {object} data barba data
     */
    beforeDestroy(data) {
      if (this.debug) {
        console.log(`${this.pageName} beforeDestroy:`, data)
      }
    }

    /**
     * destroy
     *
     * @param {object} data barba data
     */
    destroy(data) {
      if (this.debug) {
        console.log(`${this.pageName} destroy:`, data)
      }
      // this.removeScrollbar();
    }

    /**
     * setPageAttribute
     *
     * @param {object} data
     */
    setPageAttribute(data) {
      const elem = doc.querySelector(`[${this.dataAttr.page}]`);
      elem.setAttribute(this.dataAttr.page, data.next.namespace)
      elem.setAttribute(this.dataAttr.prevPage, (data.current && data.current.namespace) ? data.current.namespace : '')
    }

    /**
     * clearCacheElem
     */
    clearCacheElem() {
      this.cacheElems = [];
    }

    /**
     * setCacheElem
     *
     * @param {string} name
     * @param {object} elem
     */
    setCacheElem(name, elem) {
      this.cacheElems[name] = elem;
    }

    /**
     * getCacheElem
     *
     * @param {string} name
     * @returns {object}
     */
    getCacheElem(name) {
      return this.cacheElems[name];
    }

    /**
     * setEvent
     *
     * @param {object} elem
     * @param {string} type
     * @param {string} name
     * @param {string} key
     * @param {function} func
     * @param {options} object || boolean
     */
    setEvent(elem, type, name, key, func, options = true) {
      if (!this.event) {
        this.event = {};
      }
      if (!this.event[key]) {
        if (!key) {
          key = name;
        }
        this.event[key] = func;
      }

      switch(type) {
        case 'add': {
          elem.addEventListener(name, this.event[key], options);
          break;
        }
        case 'remove': {
          elem.removeEventListener(name, this.event[key], options);
          break;
        }
        default: {
          break;
        }
      }
    }


  };

})(window, document);

// import barbaPage from '../_partials/shared_classes/barbaPage';
// 
// export default ((win, doc) => {
//   'use strict';
// 
//   const FN = win[NS];
// 
//   return class Top extends barbaPage {
//     /**
//      * constructor
//      *
//      * @param {object} opts_
//      */
//     constructor(opts_) {
//       super();
// 
//       if (!(this instanceof Top)) {
//         return new Top(opts_);
//       }
// 
//       this.pageName = `top`;
// 
//       _.isObject(opts_) && _.extend(this, opts_);
// 
//       // this.initialize();
//     }
// 
//     /**
//      * mounted
//      *
//      * @param {object} data barba data
//      */
//     mounted(data) {
//       console.log('top mounted')
//     }
// 
//     /**
//      * destroy
//      *
//      * @param {object} data barba data
//      */
//     destroy(data) {
//       console.log('top destroy')
//     }
// 
//   };
// 
// })(window, document);



