export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * RAF
   * requestAnimationFrame
   */
  return class RAF {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof RAF)) {
        return new RAF(opts_);
      }

      this.renders = {};

      this.animationsFrame = 0;
      this.animationTime = {};
      this.animationTimeRatio = {};

      this.animationFrame = {};
      this.animationKeyDefault = 'key';

      this.easingDefault = 'linear';

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * add
     *
     * @param {string} key
     * @param {function} func
     *
     * raf.add('key', func.bind(this))
     */
    add(key, func) {
      if (this.renders[key]) { return; }
      this.renders[key] = func;
    }

    /**
     * includes
     *
     * @param {string} key
     * @returns {boolean}
     */
    includes(key) {
      return !!this.renders[key];
    }

    /**
     * remove
     *
     * @param {string} key
     *
     * raf.remove('key')
     */
    remove(key) {
      this.renders[key] = null;
      delete this.renders[key];
    }

    /**
     * update
     */
    update() {
      this.animationsFrame = win.requestAnimationFrame(this.update.bind(this));
      // console.log(this.renders)
      _.forEach(this.renders, (render) => {
        if (!render) { return; }
        render();
      })
    }

    /**
     * cancel
     */
    cancel() {
      win.cancelAnimationFrame(this.animationsFrame);
      this.animationsFrame = 0;
    }

    /**
     * animation
     *
     * @param {object} elem
     * @param {object} obj
     *
     * raf.animation(elem, {
     *   key: 'key',
     *   ease: 'linear',
     *   start: 0,
     *   end: 1,
     *   duration: 300,
     *   step: (elem, obj, value) => {
     *     move = value
     *     elem.style.opacity = value;
     *   },
     * });
     */
    animation(elem, obj) {
      const startTime =  new Date().getTime();
      const key = obj.key || this.animationKeyDefault;

      this.animationFrame[key] = false;
      const proc = (elem, obj) => {
        let nowTime =  new Date().getTime();
        let time = nowTime - obj.startTime;

        let value = this.getOnTimeValue(time, obj);

        const callback = () => {
          obj.step && obj.step(elem, obj, value);
          obj.complete && obj.complete(elem, obj, value);
          win.cancelAnimationFrame(this.animationFrame[key]);
        };

        if (time < 0) {
          value = obj.start;
          callback();
          return value;
        }

        if (time > obj.duration) {
          value = obj.end;
          callback();
          return value;
        }

        obj.step && obj.step(elem, obj, value);
        this.animationFrame[key] = win.requestAnimationFrame(proc.bind(this, elem, obj));
        return value;
      };

      obj.startTime = startTime;
      obj.step = obj.step ? obj.step : () => {};
      proc(elem, obj);
    }

    /**
     * cancelAnimation
     *
     * @param {string} key
     */
    cancelAnimation(key) {
      key = key || this.animationKeyDefault;
      win.cancelAnimationFrame(this.animationFrame[key]);
      this.animationFrame[key] = false;
    }

    /**
     * getOnTimeValue
     *
     * @param {number} time
     * @param {object} obj start, end, duration, ease
     */
    getOnTimeValue(time, obj) {
      let t = time;
      const b = obj.start;
      const c = obj.end;
      const d = obj.duration

      const easeFunction = this.ease(t, b, c, d);

      return easeFunction[obj.ease || this.easingDefault]();
    }

    /**
     * updateAnimationTimeRatio
     *
     * @param {string} key
     */
    updateAnimationTimeRatio(key) {
      const lastTime = this.animationTime[key];
      if (lastTime > 0) {
        const FPS = (1000 / 60); // 60fps
        const dTime = new Date().getTime() - lastTime;
        this.animationTimeRatio[key] = dTime / FPS;
      }
      this.animationTime[key] = new Date().getTime();
    }

    /**
     * ease
     * refs: http://gizma.com/easing/
     *
     * @param {number} t time
     * @param {number} b start
     * @param {number} c end
     * @param {num} d duration
     */
    ease(t, b, c, d) {
      return {
        easeInQuad: () => {
          return c * (t /= d) * t + b;
        },
        easeOutQuad: () => {
          t /= d
          return -(c - b) * t * (t - 2) + b;
        },
        easeInOutQuad: () => {
          t /= d/2;
          if (t < 1) return c/2*t*t + b;
          t--;
          return -c/2 * (t*(t-2) - 1) + b;
        },

        easeInCubic: () => {
          t /= d;
          return c*t*t*t + b;
        },
        easeOutCubic: () => {
          t /= d;
          t--;
          return c*(t*t*t + 1) + b;
        },
        easeInOutCubic: () => {
          t /= d/2;
          if (t < 1) return c/2*t*t*t + b;
          t -= 2;
          return c/2*(t*t*t + 2) + b;
        },

        easeInQuart: () => {
          t /= d;
          return c*t*t*t*t + b;
        },
        easeOutQuart: () => {
          t /= d;
          t--;
          return -c * (t*t*t*t - 1) + b;
        },
        easeInOutQuart: () => {
          t /= d/2;
          if (t < 1) return c/2*t*t*t*t + b;
          t -= 2;
          return -c/2 * (t*t*t*t - 2) + b;
        },

        easeInQuint: () => {
          t /= d;
          return c*t*t*t*t*t + b;
        },
        easeOutQuint: () => {
          t /= d;
          t--;
          return c*(t*t*t*t*t + 1) + b;
        },
        easeInOutQuint: () => {
          t /= d/2;
          if (t < 1) return c/2*t*t*t*t*t + b;
          t -= 2;
          return c/2*(t*t*t*t*t + 2) + b;
        },

        easeInSine: () => {
          return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOutSine: () => {
          return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOutSine: () => {
          return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },

        easeInExpo: () => {
          return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
        },
        easeOutExpo: () => {
          return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
        },
        easeInOutExpo: () => {
          t /= d/2;
          if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
          t--;
          return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
        },

        easeInCirc: () => {
          t /= d;
          return -c * (Math.sqrt(1 - t*t) - 1) + b;
        },
        easeOutCirc: () => {
          t /= d;
          t--;
          return c * Math.sqrt(1 - t*t) + b;
        },
        easeInOutCirc: () => {
          t /= d/2;
          if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
          t -= 2;
          return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
        },

        linear: () => {
          return b + ((c - b) * (t / d));
        }
      }
    }

  };

})(window, document);

