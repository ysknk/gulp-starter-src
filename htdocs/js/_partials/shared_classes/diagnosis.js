export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Diagnosis
   * <div class="content" data-diagnosis-content></div>
   */
  return class Diagnosis {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Diagnosis)) {
        return new Diagnosis(opts_);
      }

      this.dataAttr = {
        content: `data-diagnosis-content`,
        answer: `data-diagnosis-answer`
      };

      this.questionStartKey = `1`;
      this.questionCount = 0;

      this.checkedClassName = `is-checked`;
      this.checkedDelay = 0;

      this.completeClassName = `is-complete`;

      this.data = {
        "1": {
          "question": "question?", // question
          "answers": {
            "A": {
              "answer": "answer1", // string: answer
              "next": "2", // string: next question key
              // "value": 1 // number: use type increment
            },
            "B": { "answer": "answer2", "next": "2", }
          }
        },
        "2": {
          "question": "question2?",
          "answers": {
            "type": "contat", // increment or contat[default]
            "branches": { // It depends on the result
              "A": {
                "A": { "answer": "answer2-1-1", "result": "1" },
                "B": { "answer": "answer2-1-2", "result": "2" }
              },
              "B": {
                "A": { "answer": "answer2-2-1", "result": "1" },
                "B": { "answer": "answer2-2-2", "result": "2" }
              }
            }
          }
        }
      };

      this.concatString = `_`;

      this.results = [];

      this.template = [ // ejs
        `<div class="diagnosis">`,
        `<h2 class="diagnosis__number">Count: <%= data.count %></h2>`,
          `<dl class="diagnosis__content">`,
            `<dt class="diagnosis__question">Q: <%= data.question %></dt>`,
            `<dd class="diagnosis__answers">`,
              `<% for (var key in data.answers) { %>`,
              `<% var answers = data.answers[key]; %>`,
              `<button data-diagnosis-answer="<%= key %>">`,
                `<%= key %>: <%= answers.answer %>`,
              `</button>`,
              `<% } %>`,
            `</dd>`,
          `</dl>`,
        `</div>`
      ].join('');

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      this.contentElem = doc.querySelector(`[${this.dataAttr.content}]`);

      if (!this.contentElem) { return; }

      this.setTemplate(this.getTemplateHTML()
        ? this.getTemplateHTML()
        : this.template
      );

      this.goto(this.questionStartKey);

      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        const elem = e.target.closest([// delegate
          this.baseElem,
          `[${this.dataAttr.answer}]`
        ].join(' '));

        if (e.target === doc || !elem) return;

        this.procedure(elem);
      });
    }

    /**
     * setTemplate
     *
     * @param {string} html ejs
     */
    setTemplate(html) {
      this.template = _.template(html);
    }

    /**
     * getTemplateHTML
     *
     * @returns {string} html
     */
    getTemplateHTML() {
      const id = this.contentElem.getAttribute(this.dataAttr.content);
      if (!id) { return ``; }

      const templateElem = doc.querySelector(id);
      if (!templateElem) { return ``; }

      return templateElem.innerHTML;
    }

    /**
     * replaceAnswers
     *
     * @param {object} data answer data
     * @returns {object}
     */
    replaceAnswers(data) {
      let answers = data.answers;

      if (answers && answers.branches) {
        switch (answers.type) {
          case 'increment': {
            let total = 0;
            for (let i = 0; this.results.length > i; i++) {
              const result = this.results[i];
              if (!result.data) { return; }
              total += (result.data.value - 0);
            }

            let max = 0;
            let resultKey = ``;
            for (let key in answers.branches) {
              const number = key - 0;

              if (number >= total) {
                if (number >= max) {
                  max = number;
                }
                resultKey = key;
                break;
              }
            }
            data.answers = answers.branches[resultKey];
            break;
          }
          default: { // concat
            const array = [];
            for (let i = 0; this.results.length > i; i++) {
              const result = this.results[i];
              if (!result.data || !result.data.key) { return; }
              array.push(result.data.key);
            }
            const resultKey = array.join(this.concatString);
            data.answers = answers.branches[resultKey];
            break;
          }
        }
      }

      return data;
    }

    /**
     * procedure
     *
     * @param {object} elem
     */
    procedure(elem) {
      if (this.contentElem.classList.contains(this.checkedClassName)) { return; }

      const answerKey = elem.getAttribute(this.dataAttr.answer);
      const answer = this.formatAnswer(answerKey);

      this.onCheckedBefore(elem, answer);
      if (answer.result) {
        this.onCompleteBefore(elem, answer);
      }

      this.results.push({
        count: this.getQuestionCount(),
        data: answer
      });

      setTimeout(() => {
        if (answer.next) {
          this.onChecked(elem, answer);
          this.onCheckedAfter(elem, answer);
        }

        if (answer.result) {
          this.onComplete(elem, answer);
          this.onCompleteAfter(elem, answer);
        }
      }, this.checkedDelay);
    }

    /**
     * setClassName
     *
     * @param {string} action add || remove
     * @param {string} type
     * @param {object} elem
     */
    setClassName(action, type, elem) {
      this.contentElem.classList[action](this[`${type}ClassName`]);
      elem.classList[action](this[`${type}ClassName`]);
    }

    /**
     * formatAnswer
     *
     * @param {string} key
     * @returns {object}
     */
    formatAnswer(key) {
      const currentData = this.getCurrentData();
      if (!currentData) { return; }

      const answer = currentData.answers[key];
      answer.key = key;

      return answer
    }

    /**
     * goto
     *
     * @param {string} id
     * @param {object} options
     */
    goto(id, options = {}) {
      let data = this.data[id];

      this.incrementQuestionCount();
      data.count = this.getQuestionCount();
      this.setCurrentData(data);

      data = this.replaceAnswers(data);

      this.contentElem.innerHTML = this.template({
        diagnosis: this,
        data
      });
    }

    /**
     * setCurrentData
     *
     * @param {object} data answer data
     */
    setCurrentData(data) {
      this.currentData = data;
    }

    /**
     * getCurrentData
     *
     * @returns {object} answer data
     */
    getCurrentData() {
      return this.currentData;
    }

    /**
     * incrementQuestionCount
     */
    incrementQuestionCount() {
      this.questionCount++;
    }

    /**
     * getQuestionCount
     *
     * @returns {number}
     */
    getQuestionCount() {
      return this.questionCount;
    }

    /**
     * onCheckedBefore
     *
     * @param {object} elem
     * @param {object} options
     */
    onCheckedBefore(elem, options = {}) {
      this.setClassName(`add`, `checked`, elem);
    }

    /**
     * onChecked
     *
     * @param {object} elem
     * @param {object} options
     */
    onChecked(elem, options = {}) {
      this.goto(options.next, options);
    }

    /**
     * onCheckedAfter
     *
     * @param {object} elem
     * @param {object} options
     */
    onCheckedAfter(elem, options = {}) {
      this.setClassName(`remove`, `checked`, elem);
    }

    /**
     * onCompleteBefore
     *
     * @param {object} elem
     * @param {object} options
     */
    onCompleteBefore(elem, options = {}) {
      this.setClassName(`add`, `complete`, elem);

      const htmlElem = doc.documentElement;
      const complete = this.completeClassName;
      htmlElem.classList.add(complete);
      htmlElem.classList.add(`${complete}--${options.result}`);
    }

    /**
     * onComplete
     *
     * @param {object} elem
     * @param {object} options
     */
    onComplete(elem, options = {}) {
      location.href = `./result${options.result}/`;
    }

    /**
     * onCompleteAfter
     *
     * @param {object} elem
     * @param {object} options
     */
    onCompleteAfter(elem, options = {}) {}

  };

})(window, document);

