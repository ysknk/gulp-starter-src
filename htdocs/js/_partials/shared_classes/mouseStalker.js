export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * MouseStalker
   * <div class="js-mousestalker">
   *   <span class="js-mousestalker__cursor">
   *     <span class="site-mousestalker sitemousestalker--link"></span>
   *   </span>
   * </div>
   * FN.mouseStalker = new mouseStalker({
   *   cursorElemSelector: '.js-mousestalker-cursor',
   *   targetElems: {
   *     'is-link': '.is-cursor-link',
   *   }
   * });
   * FN.mouseStalker.initialize();
   */
  return class MouseStalker {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof MouseStalker)) {
        return new MouseStalker(opts_);
      }

      // this.baseElem = 'body';
      this.baseElemSelector = `.${PREFIX}base`;

      this.targetElems = {
        'is-active': 'body'// classname: selector
      };

      this.elemSelector = '.js-mousestalker';
      this.cursorElemSelector = `${this.parentElemSelector}__cursor`;
      this.throttleTime = 10;
      this.cursorRange = 0.15;
      this.cursorDuration = 0.002;

      this.isMouseOver = false;
      this.isMouseSet = false;

      this.mouse = {
        x: 0,
        y: 0
      };
      this.cursor = {
        x: 0,
        y: 0
      };

      this.transformZ = 2;

      this.elemInitializeStyle = [
        `position: fixed;`,
        `top: 0;`,
        `left: 0;`,
        `z-index: 100000;`,
        `width: 100%;`,
        `height: 100%;`,
        `pointer-events: none;`
      ].join(``);

      this.cursorElemInitializeStyle = [
        `position: absolute;`,
        `z-index: 100;`,
        `top: 0;`,
        `left: 0;`,
        `transform: translate3d(0, 0, ${this.transformZ}px);`,
        `pointer-events: none;`
      ].join(``);

      this.key = `animationFrame`;
      this.currentSelector = null;
      this.currentName = '';

      this.animationFrame = false;

      this.isUpdate = true;

      this.isEventInitialize = false;
      this.throttleTimeScroll = this.throttleTime;
      this.debounceTimeResize = this.throttleTime;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      this.clearAll();
      this.setInitializeStyle();

      if (!this.isEventInitialize) return;

      doc.body.addEventListener('mousemove', _.throttle((e) => {
        this.procedure(e);
      }, this.throttleTime), false);

      doc.body.addEventListener('mouseover', (e) => {
        this.documentIn();
      }, false);

      doc.body.addEventListener('mouseleave', (e) => {
        this.documentOut(e);
      }, false);

      win.addEventListener('scroll', _.throttle((e) => {
        this.update();
      }, this.throttleTimeScroll), false);

      win.addEventListener('resize', _.debounce((e) => {
        this.update();
      }, this.debounceTimeResize), false);
    }

    /**
     * getWindowSize
     *
     * @returns {object} width, height
     */
    getWindowSize() {
      let elem = this.getElem(`elem`);
      return {
        width: elem.getBoundingClientRect().width,
        height: elem.getBoundingClientRect().height
      };
    }

    /**
     * start
     */
    start() {
      let elem = this.getElem(`cursorElem`);
      let threshold = 1;

      this.mouse.x - this.cursor.x < threshold && this.mouse.x - this.cursor.x > - threshold
        ? this.cursor.x = this.mouse.x
        : this.cursor.x += (this.mouse.x - this.cursor.x) * this.cursorRange;

      this.mouse.y - this.cursor.y < threshold && this.mouse.y - this.cursor.y > - threshold
        ? this.cursor.y = this.mouse.y
        : this.cursor.y += (this.mouse.y - this.cursor.y) * this.cursorRange;

      // FN.anime({
      //   targets: elem,
      //   translateX: this.cursor.x,
      //   translateY: this.cursor.y,
      //   translateZ: this.transformZ,
      //   duration: this.cursorDuration
      // });
      FN.gsap.set(elem, {
        x: this.cursor.x,
        y: this.cursor.y,
        z: this.transformZ,
        duration: this.cursorDuration,
        force3D: true
      });

      this.requestAnimation(this.key, `start`);
    }

    /**
     * setPosition
     *
     * @param {object} pos
     */
    setPosition(pos) {
      let elem = this.getElem(`cursorElem`);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      this.cursor.x = this.mouse.x;
      this.cursor.y = this.mouse.y;

      FN.gsap.set(elem, {
        x: this.cursor.x,
        y: this.cursor.y,
        z: this.transformZ,
        duration: 0,
        force3D: true
      });
    }

    /**
     * requestAnimation
     *
     * @param {number} animation
     * @param {function} func
     */
    requestAnimation(animation, func) {
      // this[animation] = window.requestAnimationFrame(() => {this[func]()});
      FN.raf.add(animation, this[func].bind(this));
    }

    /**
     * cancelAnimation
     *
     * @param {number} animation
     */
    cancelAnimation(animation) {
      // window.cancelAnimationFrame(this[animation]);
      // this[animation] = 0;
      FN.raf.remove(animation);
    }

    /**
     * procedure
     *
     * @param {object} e event
     */
    procedure(e) {
      e = e || win.event;
      if (!e.target) return;
      if (!this.isMouseOver) { return; }

      let elem = this.getElem(`cursorElem`);
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (this.currentSelector) {
        const currentElem = e.target.closest(this.currentSelector);

        if (currentElem) {
          this.onMouseEnter(e, elem, this.currentSelector, this.currentName);
          this.isMouseSet = true;
          return;
        }
      }

      if (!this.isUpdate) return;

      _.forEach(this.targetElems, (targetElem, name) => {
        if (!this.isMouseOver) {
          this.onMouseLeave(e, elem, name);
          return;
        }

        const selector = targetElem;
        targetElem = selector ?
          e.target.closest(selector) : doc;

        if (e.target === doc || !targetElem) {
          this.onMouseLeave(e, elem, name);
        } else {
          this.onMouseEnter(e, elem, selector, name);
          this.isMouseSet = true;
        }
      });
    }

    /**
     * documentIn
     */
    documentIn() {
      if (!this.isMouseOver && !this.animationFrame) {
        this.requestAnimation(this.key, `start`);
      }
      this.isMouseOver = true;
    }

    /**
     * documentOut
     *
     * @param {object} e event
     */
    documentOut(e) {
      if (!e.target) return;
      this.clearAll();
    }

    /**
     * clearAll
     */
    clearAll() {
      let elem = this.getElem(`cursorElem`);
      _.forEach(this.targetElems, (targetElem, name) => {
        this.onMouseLeave(``, elem, name);
      });
      this.cancelAnimation(this.key);
      this.isMouseOver = false;
    }

    /**
     * update
     */
    update() {
      if (!this.isMouseOver) return;
      if (!this.isMouseSet) return;
      const elem = doc.elementFromPoint(this.mouse.x, this.mouse.y);

      if (!elem) return;
      this.procedure({
        target: elem,
        clientX: this.mouse.x,
        clientY: this.mouse.y
      });
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

    /**
     * setInitializeStyle
     */
    setInitializeStyle() {
      if (!this.elemInitializeStyle && !this.cursorElemInitializeStyle) return;
      let headElem = doc.querySelector('head');
      let styleElem = doc.createElement('style');

      let elemSelector = [
        this.baseElemSelector,
        this.elemSelector
      ].join(` `);

      let cursorElemSelector = [
        this.baseElemSelector,
        this.cursorElemSelector
      ].join(` `);

      styleElem.innerHTML = [
        `${elemSelector} {${this.elemInitializeStyle}}`,
        `${cursorElemSelector} {${this.cursorElemInitializeStyle}}`
      ].join(``);
      headElem.appendChild(styleElem);
    }

    /**
     * onMouseEnter
     *
     * @param {object} e event
     * @param {object} elem
     * @param {string} target
     * @param {string} name
     */
    onMouseEnter(e, elem, target, name) {
      if (!elem) return;
      elem.classList.add(name);
      this.currentSelector = target;
      this.currentName = name;
    }

    /**
     * onMouseLeave
     *
     * @param {object} e event
     * @param {object} elem
     * @param {string} name
     */
    onMouseLeave(e, elem, name) {
      if (!elem) return;
      elem.classList.remove(name);
    }

    /**
     * setUpdate
     *
     * @param {boolean} bool
     */
    setUpdate(bool) {
      this.isUpdate = bool;
    }

  };

})(window, document);

