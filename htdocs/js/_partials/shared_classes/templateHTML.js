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
      this.contentElem = doc.querySelector(`[${this.dataAttr}]`);

      if (!this.contentElem) { return; }

      let template = this.getTemplateHTML();

      if (this.islistRandom) {
        template = this.shuffle(template);
      }

      this.setTemplate(template);
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
     * @param {string} html ejs
     */
    setTemplate(html) {
      const template = _.template(html);
      // console.log({ ...this })
      this.contentElem.innerHTML = template({
        ...this
      });
    }

    /**
     * getTemplateHTML
     *
     * @returns {string} html
     */
    getTemplateHTML() {
      const id = this.contentElem.getAttribute(this.dataAttr);
      if (!id) { return ``; }

      const templateElem = doc.querySelector(id);
      if (!templateElem) { return ``; }

      return templateElem.innerHTML;
    }

  };

})(window, document);

