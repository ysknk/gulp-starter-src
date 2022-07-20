import { throttle, debounce, getOffset } from '../utilities/'

export default ((win, doc) => {
  'use strict';

  return class ScrollSmoother {
    constructor (opts_) {
      if (!(this instanceof ScrollSmoother)) {
        return new ScrollSmoother(opts_);
      }

      this.dataAttr = 'data-scroll-smoother';
      this.bodySelector = '#wrapper';
      this.translateY = 0;
      this.scrollY = 0;
      this.scrollTop = 0;
      this.power = 0.08;
      this.boundaryDistance = 0.1;
      this.raf = 0;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize()
    }

    initialize () {
      this.initializeElem()
      if (!this.elem) { return }

      this.initializeContainer();
      this.initializeBody();

      this.update();

      // document.addEventListener('scroll', throttle((() => {
      //   this.update();
      // }), 10), false);

      // window.addEventListener('resize', debounce((() => {
      //   this.update();
      // }), 10), false);

      this.onHashchange();
      win.addEventListener('hashchange', () => {
        this.onHashchange();
      }, false);
    }

    update () {
      this.onScroll();
      this.onResize();
    }

    goto (selector) {
      const elem = doc.querySelector(selector);
      if (!elem) { return }

      win.requestAnimationFrame(() => {
        if (doc.scrollingElement) {
          doc.scrollingElement.scrollTop = getOffset(elem).y;
        } else {
          doc.body.scrollTop = getOffset(elem).y;
        }
      })
    }

    onHashchange () {
      if (!location.hash) { return }
      this.goto(location.hash);
    }

    initializeElem () {
      this.elem = doc.querySelector(`[${this.dataAttr}]`);
      if (!this.elem) { return }
      this.elem.style.position = 'fixed';
      this.elem.style.width = '100%';
      this.elem.style.height = '100%';
    }

    initializeContainer () {
      const containerSelector = this.elem.getAttribute(this.dataAttr);
      this.containerElem = doc.querySelector(containerSelector);
      this.containerElem.style.overflow = 'visible';
      this.containerElem.style.willChange = 'transform'
    }

    initializeBody () {
      this.bodyElem = doc.querySelector(this.bodySelector);
      this.bodyElem.style.overflow = 'hidden';
      this.bodyElem.style.width = '100%';
    }

    setBodyResizeStyle () {
      const bodyRect = this.containerElem.getBoundingClientRect();
      this.bodyElem.style.height = `${bodyRect.height}px`;
    }

    onResize () {
      this.setBodyResizeStyle();
    }

    onScroll () {
      this.scrollY = win.scrollY;
      if (!this.raf) {
        this.render();
      }
    }

    render () {
      const nextY = this.translateY + (this.scrollY - this.translateY) * this.power;
      const isNearDistance = Math.abs(this.scrollY - nextY) <= this.boundaryDistance;
      this.translateY = isNearDistance ? this.scrollY : nextY;

      this.scrollTop = Math.round(this.translateY * 100) / 100;
      this.containerElem.style.transform = `translate3d(0, -${this.scrollTop}px, 0)`;

      if (isNearDistance) {
        this.cancelAnimationFrame();
      } else {
        this.raf = win.requestAnimationFrame(this.render.bind(this));
      }
    }

    reset () {
      this.cancelAnimationFrame();
      this.translateY = 0;
      this.scrollY = 0;
      this.containerElem.style.transform = `translate3d(0, 0, 0)`
      this.containerElem.style.willChange = `auto`
    }

    cancelAnimationFrame () {
      if (!this.raf) { return }
      win.cancelAnimationFrame(this.raf);
      this.raf = 0;
    }

  }
})(window, document);
