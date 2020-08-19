export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * FormCheck
   * <form>
   *   <div id="tel">
   *     <p class="title">tel</p>
   *     <input type="text" name="name" value="" data-form-id="name" data-form-options="">
   *     <p class="error"></p>
   *   </div>
   * </form>
   */
  return class FormCheck {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof FormCheck)) {
        return new FormCheck(opts_);
      }

      this.formSelector =  `form`;
      this.buttonSelector = `input[type="submit"], button`;

      this.nameSelector = `.title`; // #${this.validateOptions.parentId} .name
      this.errorSelector = `.error`; // #${this.validateOptions.parentId} .error

      this.requireClassName = 'is-require';
      this.errorClassName = 'is-error';
      this.disabledClassName = 'is-disabled';
      this.validClassName = 'is-valid';

      this.dataAttr = {
        id: `data-form-id`,
        options: `data-form-options`
      };

      this.validateOptions = {
        groupId: '', // unique. group elem
        parentId: '', // unique. parent elem
        isTrim: true,
        isRequire: false,
        isIntegrity: false, // [checkbox|radio|select]
        replaceZen2Han: false, // Ａ１ -> A1
        replaceHan2Zen: false, // A1 -> Ａ１

        min: 0,
        max: false,

        maxlength: false, // text only
        minlength: 0, // text only
        // matches: [{
        //   label:  '半角数字',
        //   regexp: '[0-9]+',
        //   conditions: (val) => { return val === true; },
        //   message: `個別指定エラー文言`
        // }],
        matches: [], // text only
        // equal: '', // id

        // related: [
        //   {
        //     type: "valid",
        //     elem: "#nameKana input",
        //     delay: 100
        //   }
        // ]
      };

      this.actionEvent = 'focusout'; // [change|focusout|blur]

      const isOptsLiteral = opts_ && opts_.literal;
      this.literal = {
        name: isOptsLiteral && opts_.literal.name || `%NAME%`,
        maxlength: isOptsLiteral && opts_.literal.maxlength || `%MAX_LENGTH%`,
        minlength: isOptsLiteral && opts_.literal.minlength || `%MIN_LENGTH%`,
        match: isOptsLiteral && opts_.literal.match || `%MATCH%`
      };

      this.inputMessageTemplate = opts_.inputMessageTemplate || `入力してください`;
      this.selectMessageTemplate = opts_.selectMessageTemplate || `お選びください`;

      this.messageTemplate = {
        commonName: `項目`,
        require: {
          text: `${this.literal.name}を${this.inputMessageTemplate}`,
          number: `${this.literal.name}を${this.inputMessageTemplate}`,
          password: `${this.literal.name}を${this.inputMessageTemplate}`,
          textarea: `${this.literal.name}を${this.inputMessageTemplate}`,
          checkbox: `${this.literal.name}を${this.selectMessageTemplate}`,
          radio: `${this.literal.name}を${this.selectMessageTemplate}`,
          select: `${this.literal.name}を${this.selectMessageTemplate}`
        },
        integrity: {
          checkbox: `${this.literal.name}を${this.selectMessageTemplate}`,
          radio: `${this.literal.name}を${this.selectMessageTemplate}`,
          select: `${this.literal.name}を${this.selectMessageTemplate}`
        },
        maxlength: `${this.literal.name}は${this.literal.maxlength}文字以内で${this.inputMessageTemplate}`,
        minlength: `${this.literal.name}は${this.literal.minlength}文字以上で${this.inputMessageTemplate}`,
        equal: `${this.literal.name}が一致しません`,
        match: {
          text: `${this.literal.name}を${this.literal.match}で${this.inputMessageTemplate}`,
          number: `${this.literal.name}を${this.literal.match}で${this.inputMessageTemplate}`,
          password: `${this.literal.name}を${this.literal.match}で${this.inputMessageTemplate}`,
          textarea: `${this.literal.name}を${this.literal.match}で${this.inputMessageTemplate}`,
          checkbox: `正しい${this.literal.name}を${this.selectMessageTemplate}`,
          radio: `正しい${this.literal.name}を${this.selectMessageTemplate}`,
          select: `正しい${this.literal.name}を${this.selectMessageTemplate}`
        }
      };

      this.optionsData = [];
      // this.optionsData = [
      //   {
      //     name: {
      //       isRequire: true
      //     },
      //     tel: {
      //       isRequire: true
      //     }
      //   }
      // ];

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      let inputHandleFunc = (e) => {
        if (!e.target || !e.target.closest) return;
        let elem = e.target.closest(`[${this.dataAttr.id}]`);// delegate
        if (e.target === doc || !elem) return;
        this.update(elem);
      };
      if (this.actionEvent.match(/^(focusout|blur)$/i)) {
        doc.addEventListener('focusout', inputHandleFunc, false);
        doc.addEventListener('change', inputHandleFunc, false);
      } else {
        doc.addEventListener('change', inputHandleFunc, false);
        doc.addEventListener('keyup', inputHandleFunc, false);
        doc.addEventListener('touchend', inputHandleFunc, false);
      }

      let formHandleFunc = (e) => {
        if (!e.target || !e.target.closest) return;
        let elem = e.target.closest(`${this.formSelector}`);// delegate
        if (e.target === doc || !elem) return;
        e.preventDefault();
        let isError = this.update(elem, {
          isAll: true
        });
        if (!isError) {
          elem.submit();
        }
      };
      doc.addEventListener('submit', formHandleFunc, false);
    }

    /**
     * saveOptionData
     */
    saveOptionData() {
      const formElems = doc.querySelectorAll(this.formSelector);

      _.forEach(formElems, (formElem, i) => {
        if (!this.optionsData[i]) {
          this.optionsData[i] = {};
        }

        const validateElems = formElem.querySelectorAll(`[${this.dataAttr.id}]`);
        _.forEach(validateElems, (validateElem) => {
          if (!validateElem) {
            return;
          }
          const name = validateElem.getAttribute(this.dataAttr.id);
          const options = this.getOptions(validateElem, i);
          if (!this.optionsData[i][name]) {
            this.optionsData[i][name] = {};
          }

          this.setInputAttribute(validateElem, options);
          this.setRequireClassName(options);

          const type = this.getInputType(validateElem);
          const checkType = type.match(/[checkbox|radio|select]/)
          if (!checkType
            || (checkType && !this.optionsData[i][name].values)) {
            this.optionsData[i][name] = _.extend({}, this.validateOptions, options);
          }

          this.dataPushValues(type, this.optionsData[i][name], validateElem);
        });
      });
      // console.log(this.optionsData)
    }

    /**
     * setInputAttribute
     *
     * @param {object} elem
     * @param {object} options
     */
    setInputAttribute(elem, options) {
      if (options.min) {
        elem.setAttribute('min', options.min);
      }
      if (options.max) {
        elem.setAttribute('max', options.max);
      }
      if (options.maxlength) {
        elem.setAttribute('maxlength', options.maxlength);
      }
      if (options.minlength) {
        elem.setAttribute('minlength', options.minlength);
      }
    }

    /**
     * setRequireClassName
     *
     * @param {object} options
     */
    setRequireClassName(options) {
      const elems = this.getElems(options);
      if (!elems || (!elems.group && !elems.parent)) {
        return;
      }

      const elem = elems.group || elems.parent;
      if (options.isRequire) {
        elem.classList.add(this.requireClassName);
      } else {
        elem.classList.remove(this.requireClassName);
      }
    }

    /**
     * dataPushValues
     *
     * @param {string} type
     * @param {object} data
     * @param {object} elem
     */
    dataPushValues(type, data, elem) {
      if (!data.values) {
        data.values = [];
      }

      switch(type) {
        case `checkbox`:
        case `radio`:
          data.values.push(elem.value);
          break;
        case `select`: {
          const options = elem.querySelectorAll('option');
          _.forEach(options, (option) => {
            data.values.push(option.value);
          });
          break;
        }
        default:
          break;
      }
    }

    /**
     * getOptionData
     *
     * @param {number} formNumber
     * @param {string} name
     * @returns {object}
     */
    getOptionData(formNumber, name) {
      return this.optionsData[formNumber][name];
    }

    /**
     * update
     *
     * @param {object} elem not require
     * @param {object} updateOptions
     */
    update(elem, updateOptions) {
      const formElems = doc.querySelectorAll(this.formSelector);
      let result = false;

      _.forEach(formElems, (formElem, i) => {
        let isAll = false;
        if ((updateOptions && updateOptions.isAll) && elem === formElem) {
          isAll = true;
        }

        const validateElems = formElem.querySelectorAll(`[${this.dataAttr.id}]`);
        let isError = false;

        _.forEach(validateElems, (validateElem) => {
          if (!validateElem) {
            return;
          }

          let options = this.getOptions(validateElem, i);
          if (!options.parentId) {
            return;
          }

          this.formatValue(validateElem, options);

          let valid = this.checkValid(validateElem, options);
          if (!isError) {
            isError = !valid.status;
          }

          const elems = this.getElems(options);
          if (isAll || elem === validateElem) {
            if (isError && valid.message) {
              this.visibleMessage(elems, valid.message, options);
            } else {
              this.hideMessage(elems, options);
            }
            this.checkRelated(options);
          }
        });

        this.setSubmitStatus(formElem, isError);
        if (isAll) {
          result = isError;
        }
      });
      return result;
    }

    /**
     * getValidClassName
     *
     * @param {string} id
     * @returns {string}
     */
    getValidClassName(id) {
      return `${this.validClassName}${id ? '-' + id : ``}`;
    }

    /**
     * getOptions
     *
     * @param {object} elem
     * @param {number} form number
     * @returns {object}
     */
    getOptions(elem, num) {
      const name = elem.getAttribute(this.dataAttr.id);
      const optionsString = elem.getAttribute(this.dataAttr.options) || '';
      return this.getOptionData(num, name)
        || this.getParseData(optionsString);
    }

    /**
     * visibleMessage
     *
     * @param {object} elems
     * @param {string} message
     * @param {object} options
     */
    visibleMessage(elems, message, options) {
      if (elems.parent) {
        const validClassName = this.getValidClassName(options.parentId);
        elems.parent.classList.remove(validClassName);
        elems.parent.classList.add(this.errorClassName);
        elems.group && elems.group.classList.remove(validClassName);
        elems.group && elems.group.classList.add(this.errorClassName);
      }
      if (!elems.error) return;
      elems.error.innerHTML = message;
      elems.error.style.display = `block`;
    }

    /**
     * hideMessage
     *
     * @param {object} elems
     * @param {object} options
     */
    hideMessage(elems, options) {
      if (elems.parent) {
        const validClassName = this.getValidClassName(options.parentId);
        elems.parent.classList.add(validClassName);
        elems.parent.classList.remove(this.errorClassName);
        elems.group && elems.group.classList.add(validClassName);
        elems.group && elems.group.classList.remove(this.errorClassName);
      }
      if (!elems.error) return;
      elems.error.style.display = `none`;
      elems.error.innerHTML = '';
    }

    /**
     * getParseData
     *
     * @param {string} json
     * @returns {object}
     */
    getParseData(json) {
      let data = json || '';
      if (data) {
        try {
          data = JSON.parse(data);
        }catch(e) {
          if (console.warn) {
            console.warn(e);
          } else {
            console.log(e);
          }
        }
      }
      return data
    }

    /**
     * setSubmitStatus
     *
     * @param {object} formElem
     * @param {boolean} isError
     */
    setSubmitStatus(formElem, isError) {
      let buttonElems = formElem.querySelectorAll(this.buttonSelector);
      _.forEach(buttonElems, (buttonElem) => {
        if (isError) {
          this.setButtonDisable(formElem, buttonElem);
        } else {
          this.setButtonActive(formElem, buttonElem);
        }
      });
    }

    /**
     * setButtonDisable
     *
     * @param {object} formElem
     * @param {object} buttonElem
     */
    setButtonDisable(formElem, buttonElem) {
      formElem.classList.add(this.disabledClassName);
      buttonElem.classList.add(this.disabledClassName);
      buttonElem.disabled = true;
    }

    /**
     * setButtonActive
     *
     * @param {object} formElem
     * @param {object} buttonElem
     */
    setButtonActive(formElem, buttonElem) {
      formElem.classList.remove(this.disabledClassName);
      buttonElem.classList.remove(this.disabledClassName);
      buttonElem.disabled = false;
    }

    /**
     * formatValue
     *
     * @param {object} elem obj
     * @param {object} options
     */
    formatValue(elem, options) {
      if (options.isTrim) {
        if (String.prototype.trim) {
          elem.value = elem.value.trim();
        }
      }

      if (options.replaceZen2Han) {
        this.replaceZen2Han(elem);
      }

      if (options.replaceHan2Zen) {
        this.replaceHan2Zen(elem);
      }
    }

    /**
     * checkValid
     *
     * @param {object} elem
     * @param {object} options
     * @returns {object} {status, message}
     */
    checkValid(elem, options) {
      const length = [...elem.value].length;
      const type = this.getInputType(elem);

      let message = this.messageTemplate;
      let result = {
        status: true,
        message: '',
        value: elem.value || ''
      };

      switch (type) {
        case `checkbox`: {
          const arrayEmptyChecked = this.checkArrayEmpty(elem);
          if (options.isRequire && !arrayEmptyChecked) {
            result.status = false;
            result.message = this.replaceMessage(message.require.checkbox, options);
            return result;
          }
          const arrayIntegrityChecked = this.checkArrayIntegrity(elem, options);
          if (options.isIntegrity && !arrayIntegrityChecked) {
            result.status = false;
            result.message = this.replaceMessage(message.integrity.checkbox, options);
            return result;
          }
          break;
        }
        case `radio`: {
          const arrayEmptyChecked = this.checkArrayEmpty(elem);
          if (options.isRequire && !arrayEmptyChecked) {
            result.status = false;
            result.message = this.replaceMessage(message.require.radio, options);
            return result;
          }
          const arrayIntegrityChecked = this.checkArrayIntegrity(elem, options);
          if (options.isIntegrity && !arrayIntegrityChecked) {
            result.status = false;
            result.message = this.replaceMessage(message.integrity.radio, options);
            return result;
          }
          break;
        }
        case `select`: {
          if (options.isRequire && this.isInputEmpty(elem)) {
            result.status = false;
            result.message = this.replaceMessage(message.require.select, options);
            return result;
          }
          if (options.isIntegrity && !this.checkValuesMatch(elem.value, options)) {
            result.status = false;
            result.message = this.replaceMessage(message.integrity.select, options);
            return result;
          }
          break;
        }
        // case `text`:
        default: {
          if (options.isRequire && this.isInputEmpty(elem)) {
            result.status = false;
            result.message = this.replaceMessage(message.require[type], options);
            return result;
          }
          if (options.maxlength && length > options.maxlength) {
            result.status = false;
            result.message = this.replaceMessage(message.maxlength, options);
            return result;
          }
          if (options.minlength && options.minlength > length) {
            result.status = false;
            result.message = this.replaceMessage(message.minlength, options);
            return result;
          }
          if (options.matches && options.matches.length) {
            _.forEach(options.matches, (match) => {
              if (match.conditions) {
                if (!match.conditions(elem.value)) {
                  result.status = false;
                  result.message = match.message || this.replaceMessage(message.match[type].replace(this.literal.match, match.label), options);
                  return false;
                }
              }
              if (match.regexp) {
                const ex = new RegExp(match.regexp);
                if (!elem.value.match(ex)) {
                  result.status = false;
                  result.message = match.message || this.replaceMessage(message.match[type].replace(this.literal.match, match.label), options);
                  return false;
                }
              }
            });
          }
          if (options.equal) {
            const elems = this.getElems(options);
            if (elems.equal.value != ''
              && elem.value != elems.equal.value) {
              result.status = false;
              result.message = this.replaceMessage(message.equal, options);
              return result;
            } else if (elem.value == elems.equal.value) {
              this.hideMessage(elems, {id: options.equal});
              return result;
            }
          }
          break;
        }
      }
      return result;
    }

    /**
     * replaceZen2Han
     *
     * @param {object} elem
     */
    replaceZen2Han(elem) {
      const replaceValue = (input) =>  {
        return input.replace(/[！-～]/g, (input) => {
          return String.fromCharCode(input.charCodeAt(0)-0xFEE0);
        });
      };
      elem.value = replaceValue(elem.value);
    }

    /**
     * replaceHan2Zen
     *
     * @param {object} elem
     */
    replaceHan2Zen(elem) {
      const replaceValue = (input) =>  {
        return input.replace(/[!-~]/g, (input) => {
          return String.fromCharCode(input.charCodeAt(0)+0xFEE0);
        });
      };
      elem.value = replaceValue(elem.value);
    }

    /**
     * getElems
     *
     * @param {object} options
     * @returns {object}
     */
    getElems(options) {
      if (!options) {
        return;
      }
      const group = options.groupId && doc.querySelector(`#${options.groupId}`) || '';
      const parent = options.parentId && doc.querySelector(`#${options.parentId}`) || '';
      const name = parent && parent.querySelector(this.nameSelector) || '';
      const error = parent && parent.querySelector(this.errorSelector) || '';
      const equal = parent && parent.querySelector(`[${this.dataAttr.id}]`) || '';
      return {
        group,
        parent,
        name,
        error,
        equal
      };
    }

    /**
     * checkRelated
     *
     * @param {object} options
     */
    checkRelated(options) {
      if (!options.related) {
        return;
      }
      _.forEach(options.related, (related) => {
        setTimeout(() => {
          const elem = doc.querySelector(related.elem);
          switch(related.type) {
            case 'valid': {
              this.update(elem);
              break;
            }
            default: {
              break;
            }
          }
        }, related.delay);
      });
    }

    /**
     * getInputType
     *
     * @param {object} elem
     * @returns {string}
     */
    getInputType(elem) {
      if (!elem) {
        return '';
      }
      return elem && elem.tagName.match(/input/i)
        ? elem.type
        : elem.tagName.toLowerCase();
    }

    /**
     * checkArrayEmpty
     *
     * @param {object} elem
     * @returns {object} {status, message}
     */
    checkArrayEmpty(elem) {
      let isChecked = false;
      let groupElems = doc.querySelectorAll(`[name="${elem.name}"]`);
      _.forEach(groupElems, (groupElem) => {
        if (groupElem.checked) {
          // _.forEach(groupElems, (groupElem) => {
          //   groupElem.setAttribute(this.dataAttr.id, '');
          // });
          //
          if (!this.isInputEmpty(groupElem)) {
            isChecked = true;
          }
          return false;
        }
      });
      return isChecked;
    }

    /**
     * isInputEmpty
     *
     * @param {object} elem
     * @returns {boolean}
     */
    isInputEmpty(elem) {
      return (!elem.value || elem.value.match(/^\s+$/g));
    }

    /**
     * checkValuesMatch
     *
     * @param {string} value
     * @param {object} options
     */
    checkValuesMatch(value, options) {
      let isChecked = false
      _.forEach(options.values, (val) => {
        if (value === val) {
          isChecked = true;
          return false;
        }
      });
      return isChecked;
    }

    /**
     * checkArrayIntegrity
     *
     * @param {object} elem
     * @param {object} options
     * @returns {object} {status, message}
     */
    checkArrayIntegrity(elem, options) {
      let isChecked = false;
      let groupElems = doc.querySelectorAll(`[name="${elem.name}"]`);
      _.forEach(groupElems, (groupElem) => {
        if (groupElem.checked) {
          isChecked = this.checkValuesMatch(groupElem.value, options)
          return false;
        }
      });
      return isChecked;
    }

    /**
     * replaceMessage
     *
     * @param {string} message
     * @param {object} options
     */
    replaceMessage(message, options) {
      const parentElem = doc.querySelector(`#${options.parentId}`);
      const nameElem = parentElem.querySelector(this.nameSelector);
      const name = nameElem
        ? nameElem.innerHTML
        : this.messageTemplate.commonName;
      return message
        .replace(this.literal.name, name || '')
        .replace(this.literal.maxlength, options.maxlength || '')
        .replace(this.literal.minlength, options.minlength || '');
    }

  };

})(window, document);

