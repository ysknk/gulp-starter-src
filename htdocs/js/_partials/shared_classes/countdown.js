import { zeroPadding } from '../utilities/'

export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Countdown
   * @requires moment.js
   * <div data-countdown-date>
   *   <div data-countdown-units="days"></div>
   *   <div data-countdown-units="hours"></div>
   *   <div data-countdown-units="mins"></div>
   *   <div data-countdown-units="secs"></div>
   * </div>
   */
  return class Countdown {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Countdown)) {
        return new Countdown(opts_);
      }

      this.dateFormat = `YYYY-M-D H:m`;
      this.targetDate = `2100-12-31 00:00`;

      this.showType = `text`;// text or background

      this.endClassName = `is-countdown-end`;
      this.initClassName = `is-countdown-init`;

      this.dataAttr = {
        date: `data-countdown-date`,
        units: `data-countdown-units`,
        value: `data-countdown-value`
      };

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * update
     */
    update() {
      this.date = doc.querySelector(`[${this.dataAttr.date}]`);
      this.elems = doc.querySelectorAll(`[${this.dataAttr.units}]`);

      if (this.date) {
        this.targetDate = this.date.getAttribute(this.dataAttr.date)
          || this.targetDate;
      }

      if (this.isEnd()) {
        this.setEnd();
      } else {
        this.updateTime();
      }
    }

    /**
     * getEnd
     *
     * @returns {boolean}
     */
    getEnd() {
      let html = doc.querySelector(`html`);
      return html.classList.contains(this.endClassName);
    }

    /**
     * setEnd
     */
    setEnd() {
      const html = doc.querySelector(`html`);
      if (!html.classList.contains(this.initClassName)) {
        html.classList.add(this.endClassName);
      }
    }

    /**
     * setInit
     */
    setInit() {
      const html = doc.querySelector(`html`);
      if (!html.classList.contains(this.initClassName)) {
        html.classList.add(this.initClassName);
      }
    }

    /**
     * setValues
     */
    setValues() {
      const time = this.getDiffTimes();
      _.forEach(this.elems, (elem) => {
        this.setHTML(time, elem);
      });
      this.setInit();
    }

    /**
     * setHTML
     *
     * @param {string} time
     * @param {object} elem
     */
    setHTML(time, elem) {
      const attr = elem.getAttribute(this.dataAttr.units);
      const value = time[attr];
      if (elem.getAttribute(this.dataAttr.value) == value) return;
      elem.setAttribute(this.dataAttr.value, value);

      switch(this.showType) {
        case `text`: {
          elem.innerHTML = value;
          break;
        }
        case `background`: {
          const valueElems = elem.querySelectorAll(`[${this.dataAttr.value}]`);
          const splits = value.split(``);

          if (valueElems && valueElems.length) {
            _.forEach(splits, (split, i) => {
              valueElems[i].setAttribute(this.dataAttr.value, split);
            });
          }else{
            elem.innerHTML = ``;
            _.forEach(splits, (split) => {
              let span = doc.createElement(`span`);
              span.setAttribute(this.dataAttr.value, split);
              elem.appendChild(span);
            });
          }
          break;
        }
        default: {
          break;
        }
      }
    }

    /**
     * updateTime
     */
    updateTime() {
      setTimeout(() => {
        if (this.isEnd()) {
          this.setEnd();
        } else {
          this.setValues();
          this.updateTime();
        }
      }, 1000);
    }

    /**
     * isEnd
     *
     * @returns {boolean}
     */
    isEnd() {
      const diffTime = this.getTargetDate().diff(FN.moment());
      return (this.getEnd() || !diffTime || diffTime <= 0) ? true : false;
    }

    /**
     * getTargetDate
     *
     * @returns {object} moment
     */
    getTargetDate() {
      return FN.moment(this.targetDate, this.dateFormat);
    }

    /**
     * getDiffTimes
     *
     * @returns {object} days, hours, mins, secs
     */
    getDiffTimes() {
      const diffTime = this.getTargetDate().diff(FN.moment());
      const duration = FN.moment.duration(diffTime);

      let days = Math.floor(duration.asDays());
      let hours = duration.hours();
      let mins = duration.minutes();
      let secs = duration.seconds();

      days = zeroPadding(days, 3);
      hours = zeroPadding(hours, 2);
      mins = zeroPadding(mins, 2);
      secs = zeroPadding(secs, 2);

      return {
        days,
        hours,
        mins,
        secs
      };
    }

  };

})(window, document);

