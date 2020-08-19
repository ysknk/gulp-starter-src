export default ((win, doc) => {
  'use strict';

  /**
   * TOC
   * クラス名をキーにして、目次を生成する
   * 上部要素から順にタイトルを確認、一つ前のタイトルのh*タグと比べて、
   * 数字が大きいか小さいかで入れ子を判断する
   * <div class="site-toc"></div>
   * <div>
   *   <h2 class="site-title">title1</h2>
   *   <h3 class="site-title">title1-1</h3>
   *   <h2 class="site-title">title2</h2>
   *   <h3 class="site-title">title2-1</h3>
   *   <h4 class="site-title">title2-1-1</h4>
   * </div>
   */
  return class TOC {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof TOC)) {
        return new TOC(opts_);
      }

      this.elemName = `${PREFIX}toc`;
      this.elemSelector = `.${this.elemName}`;
      this.titleElemSelector = `.${PREFIX}title`;

      this.minLevel = 2;
      this.maxLevel = 6;

      this.template = {
        base: `
          <dl class="${this.elemName}__inner">
            <dt class="${this.elemName}__title">\u76EE\u6B21</dt>
            <dd class="${this.elemName}__list">
              <ol></ol>
            </dd>
          </dl>
        `,
        list: `
          <span class="${this.elemName}__label">
            <a href="#{{id}}">{{title}}</a>
          </span>
        `
      };

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * procedure
     */
    procedure() {
      const tocs = doc.querySelectorAll(this.elemSelector);
      if (!tocs.length) return;

      _.forEach(tocs, (toc) => {
        this.clear(toc);
        this.create(toc);
      });
    }

    /**
     * getHeaderLevel
     *
     * @param {object} elem
     * @returns {object}
     */
    getHeaderLevel(elem) {
      return elem.tagName.match(/^h(\d+)$/i);
    }

    /**
     * create
     *
     * @param {object} elem toc element
     */
    create(elem) {
      const content = elem.parentNode;
      const titles = content.querySelectorAll(this.titleElemSelector);

      let list = '';
      let prev = {};
      const counter = [];

      elem.innerHTML = this.template.base;

      const baseOrder = elem.querySelector('ol');

      _.forEach(titles, (title) => {
        if (!title.innerHTML || !this.getHeaderLevel(title)) return;

        const createList = doc.createElement('li');
        const createOrder = doc.createElement('ol');

        let ol = prev.ol || baseOrder;
        let li = '';

        const level = parseInt(this.getHeaderLevel(title)[1], 10);

        if (this.minLevel > level || level > this.maxLevel) return;

        // counter init
        if (!counter[level]) counter[level] = 1;
        if (counter[level]) counter[level]++;

        // init under level
        // ex: if(h3){[h4,5,6]{level = 1}}
        for (let j = level + 1; this.maxLevel >= j; j++) {
          counter[j] = 1;
        }

        const id = (() => {
          let result = '';

          if (level !== this.minLevel && prev && prev.level) {
            // same
            if (level == prev.level) {
              result = prev.id.replace(/(\d+)$/i, counter[level] - 1);
              return result;
            // forward
            } else if (level > prev.level) {
              result = prev.id + '-' + (counter[level] - 1);

              const list = ol.querySelectorAll('li');
              ol = list[list.length - 1].appendChild(createOrder);
              if (level - prev.level >= 2) {
                for (let j = 0; level - prev.level - 1 > j; j++) {
                  result += '-' + (counter[level] - 1 || 1);

                  const createList = doc.createElement('li');
                  const createOrder = doc.createElement('ol');
                  li = ol.appendChild(createList);
                  ol = li.appendChild(createOrder);
                }
              }
              return result;
            // back
            } else if (level < prev.level) {
              if (prev.level - level >= 2) {
                for (let j = 0; prev.level - level - 1 > j; j++) {
                  prev.id = prev.id.replace(/\-(\d+)$/i, '');
                  ol = ol.parentNode.parentNode;
                }
              }
              ol = ol.parentNode.parentNode;
              result = prev.id.replace(/(\d+)-(\d+)$/i, counter[level] - 1);
              return result;
            }
          }

          ol = baseOrder;
          list = prev && prev.list
            ? prev.list.replace(/{{nextOrder}}/ig, '') || prev.list
            : '';
          return counter[level] - 1;
        })();

        this.setTitleAttribute(title, id, level);

        li = ol.appendChild(createList);
        li.innerHTML = this.template.list.replace(/{{title}}/ig, title.innerHTML || '').replace(/{{id}}/ig, title.id);

        prev = {id, level, ol, li};
      });
    }

    /**
     * setTitleAttribute
     *
     * @param {object} elem
     * @param {string} id
     * @param {number} level
     */
    setTitleAttribute(elem, id, level) {
      elem.id = 'heading-' + id;
      elem.setAttribute('data-level', level);
      elem.setAttribute('data-id', id);
    }

    /**
     * clear
     *
     * @param {object} elem toc element
     */
    clear(elem) {
      elem.innerHTML = '';
    }

  };

})(window, document);

