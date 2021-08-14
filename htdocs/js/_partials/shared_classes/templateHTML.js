export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * TemplateHTML
   */
  return class TemplateHTML {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof TemplateHTML)) {
        return new TemplateHTML(opts_);
      }

      this._ = _; // NOTE: lodash

      this.data = null; // NOTE: use template
      this.dataAttr = `data-template-html`;

      this.listElemSelector = `.list__item`;
      this.islistRandom = false;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      this.contentElems = doc.querySelectorAll(`[${this.dataAttr}]`);

      if (!this.contentElems.length) { return; }

      _.forEach(this.contentElems, (elem) => {
        let template = this.getTemplateHTML(elem);

        if (this.islistRandom) {
          template = this.shuffle(template);
        }

        this.setTemplate(elem, template);
      });
    }

    /**
     * shuffle
     *
     * @param {string} template html
     * @returns {string} html
     */
    shuffle (template) {
      const div = doc.createElement(`div`);
      div.innerHTML = template;
      let li = div.querySelectorAll(this.listElemSelector);
      li = _.shuffle(li);

      let html = ``;
      _.forEach(li, (item) => {
        html += item.outerHTML;
      });
      return html;
    }

    /**
     * setTemplate
     *
     * @param {object} elem
     * @param {string} html ejs
     */
    setTemplate(elem, html) {
      const template = _.template(html);
      // console.log({ ...this })
      elem.innerHTML = template({
        ...this
      });
    }

    /**
     * getTemplateHTML
     *
     * @param {object} elem
     * @returns {string} html
     */
    getTemplateHTML(elem) {
      const id = elem.getAttribute(this.dataAttr);
      if (!id) { return ``; }

      const templateElem = doc.querySelector(id);
      if (!templateElem) { return ``; }

      return templateElem.innerHTML;
    }

  };

})(window, document);

