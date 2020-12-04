import { parseJSON, getWindowRect, getElemRect } from '../utilities/'

export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Parallax
   * <div data-parallax='{"move": "Y", "dir": false, "power": 0.2, "range": 0.2, "prop": "y"}'>hoge</div>
   */
  return class Parallax {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Parallax)) {
        return new Parallax(opts_);
      }

      this.dataAttr = `data-parallax`;

      this.options = {
        move: "Y",// translate${move}
        dir: true,// + or -
        power: 0.5,
        range: 0.4,
        unit: "%",
        prop: "",// default transform,
        rect: ""// rect target
      };

      opts_.options = Object.assign({}, this.options, opts_.options);
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
      const elems = doc.querySelectorAll(`[${this.dataAttr}]`);
      const windowRect = getWindowRect();

      _.forEach(elems, (elem) => {
        const data = this.getMergeData(elem);
        const rect = data.rect && doc.querySelector(data.rect);
        const targetRect = getElemRect(rect || elem);

        const topLimit = targetRect.bottom >= windowRect.top;
        const bottomLimit = windowRect.bottom >= targetRect.top;

        let power = 0;
        let perPower = 0;
        let isSetTransform = false;

        // 画面内
        if (topLimit && bottomLimit) {
          const windowMiddle = windowRect.top + (windowRect.height / 2);
          const targetMiddle = targetRect.top + (targetRect.height / 2);
          const range = (windowRect.height * data.range);

          const bottomRange = (windowMiddle + range);
          const topRange = (windowMiddle - range);

          // 中央よりも上？下？
          if (bottomRange >= targetMiddle && topRange <= targetMiddle) {
            if (windowMiddle >= targetMiddle) {
              power = (targetMiddle - windowMiddle);
            } else if (windowMiddle <= targetMiddle){
              power = (targetMiddle - windowMiddle);
            }
            perPower = ((power / range) * 100) * data.power;
            isSetTransform = true;
          }

        } else if (topLimit) {
          perPower = 100 * data.power;
          isSetTransform = true;

        } else if (bottomLimit) {
          perPower = -(100 * data.power);
          isSetTransform = true;
        }

        if (isSetTransform) {
          perPower = data.dir ? perPower : -perPower;
          const translate = `translate${data.move.toUpperCase()}(${perPower}${data.unit})`;
          if (data.prop) {
            if (data.prop === `opacity`) {
              elem.style[data.prop] = `${perPower / 100}`;
            } else if (data.prop.match(/^[x|y|z]$/i)){
              elem.style.transform = translate;
            } else {
              elem.style[data.prop] = `${perPower}${data.unit}`;
            }
          } else {
            elem.style.transform = translate;
          }
        }

      });
    }

    /**
     * getMergeData
     *
     * @param {object} elem
     * @returns {object}
     */
    getMergeData(elem) {
      const attr = elem.getAttribute(this.dataAttr) || '';
      let data = parseJSON(attr);
      return data = _.merge({}, this.options, data)
    }

  };

})(window, document);

