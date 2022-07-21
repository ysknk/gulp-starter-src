/**
 * sleep
 *
 * @param {number} ms
 * @returns {promise}
 */
export const sleep = (ms) => {
  return new Promise((resolve) => { return setTimeout(resolve, ms); });
}

/**
 * isTouch
 *
 * @returns {boolean}
 */
export const isTouch = () => {
  if (navigator.msPointerEnabled) {
    return true
  } else {
    if ('ontouchstart' in window) {
      return true
    }
    if ('onmousedown' in window) {
      return false
    }
  }
}

/**
 * parseJSON
 *
 * @param {string} txt
 * @returns {object}
 */
export function parseJSON(txt) {
  let result = null;
  if (!txt) { return result; }

  try {
    result = JSON.parse(txt);
  } catch (e) {
    if (console.warn) {
      console.warn(e);
    } else {
      console.log(e);
    }
  }
  return result;
}

/**
 * getOffset
 *
 * @param {object} elem
 * @returns {object} position x, y
 */
export function getOffset(elem) {
  const pos = {
    x: 0,
    y: 0
  };

  while (elem) {
    pos.y += elem.offsetTop || 0;
    pos.x += elem.offsetLeft || 0;
    elem = elem.offsetParent;
  }
  return pos;
}

/**
 * getWindowRect
 *
 * @returns {object}
 */
export function getWindowRect() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const top = window.pageYOffset;

  return {
    width,
    height,

    top,
    middle: (top + (height / 2)),
    bottom: (top + height)
  };
}

/**
 * getElemRect
 *
 * @param {object} elem target
 * @returns {object}
 */
export function getElemRect(elem) {
  const rect = elem.getBoundingClientRect();

  const width = rect.width;
  const height = rect.height;

  const top = getOffset(elem).y
    || rect.y + getWindowRect().top
    || 0;

  return {
    width,
    height,

    top,
    middle: (top + (height / 2)),
    bottom: (top + height)
  };
}

/**
 * getURLQuery
 *
 * @param {string} param
 * @param {string} url default location.href
 * @returns {string} value
 */
export function getURLQuery(param, url = location.href) {
  if (!param) return;
  param = param.replace(/[\[\]]/g, '\\$&');

  const regex = new RegExp('[?&]' + param + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * zeroPadding
 *
 * @param {number} num
 * @param {number} digit
 * @returns {string}
 */
export function zeroPadding(num, digit = 2) {
  return (Array(digit).join('0') + num).slice(-digit);
}

/**
 * zenToHan
 *
 * @param {string} str
 * @returns {string}
 */
export function zenToHan(str) {
  const replaceStr = (input) =>  {
    return input.replace(/[！-～]/g, (input) => {
      return String.fromCharCode(input.charCodeAt(0) - 0xFEE0);
    });
  };
  return replaceStr(str).replace(/”/g, "\"")
    .replace(/’/g, "'")
    .replace(/‘/g, "`")
    .replace(/￥/g, "\\")
    .replace(/　/g, " ")
    .replace(/〜/g, "~");
}

/**
 * hanToZen
 *
 * @param {string} str
 * @returns {string}
 */
export function hanToZen(str) {
  const replaceStr = (input) =>  {
    return input.replace(/[!-~]/g, (input) => {
      return String.fromCharCode(input.charCodeAt(0) + 0xFEE0);
    });
  };
  return replaceStr(str).replace(/\"/g, "”")
    .replace(/'/g, "’")
    .replace(/`/g, "‘")
    .replace(/\\/g, "￥")
    .replace(/ /g, "　")
    .replace(/~/g, "～");
}

/**
 * kebabToCamel
 *
 * @param {string} str
 * @returns {string}
 */
export function kebabToCamel(str) {
  str = str.charAt(0).toLowerCase() + str.slice(1);
  return str.replace(/[-_](.)/g, function(match, headStr) {
    return headStr.toUpperCase();
  });
}

/**
 * isSupportedHistoryAPI
 *
 * @param {string} str
 * @returns {string}
 */
export function isSupportedHistoryAPI() {
  return (window.history && window.history.pushState);
}

/**
 * getTranslateValues
 *
 * @param {object} elem
 * @returns {object}
 */
export function getTranslateValues(elem) {
  const style = window.getComputedStyle(elem);
  const matrix = style['transform'] || style.webkitTransform || style.mozTransform;

  // No transform property. Simply return 0 values.
  if (matrix === 'none') {
    return { x: 0, y: 0, z: 0 };
  }

  // Can either be 2d or 3d transform
  const matrixType = matrix.includes('3d') ? '3d' : '2d';
  const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');

  // 2d matrices have 6 values
  // Last 2 values are X and Y.
  // 2d matrices does not have Z value.
  if (matrixType === '2d') {
    return {
      x: matrixValues[4],
      y: matrixValues[5],
      z: 0
    };
  }

  // 3d matrices have 16 values
  // The 13th, 14th, and 15th values are X, Y, and Z
  if (matrixType === '3d') {
    return {
      x: matrixValues[12],
      y: matrixValues[13],
      z: matrixValues[14]
    };
  }
}

/**
 * objectToArray
 *
 * @param {object}
 * @returns {array}
 */
export function objectToArray(obj) {
  return Object.keys(obj).map(function (key) {
    return {
      key: key,
      value: obj[key]
    }
  })
}

/**
 * getInnerText
 *
 * @param {string}
 * @returns {string}
 */
export const getInnerText = (text) => {
  const div = document.createElement('div')
  div.innerHTML = text
  return div.innerText
}

/**
 * getObjectLength
 *
 * @param {object} obj
 * @returns {number}
 */
export function getObjectLength(obj) {
  return Object.keys(obj).length - 1;
}

/**
 * isNumber
 *
 * @param {number} n
 * @returns {boolean}
 */
export function isNumber(n) {
  if ( typeof(n) === 'number' && Number.isFinite(n) ) {
    return true;
  }
  return false;
}

/**
 * isNumberAllowString
 *
 * @param {number|string} n
 * @returns {boolean}
 */
export function isNumberAllowString(n) {
  const type = typeof(n);
  if ( type === 'number' && Number.isFinite(n) ) {
    return true;
  }
  if ( type === 'string' && n.trim() !== '' && Number.isFinite(n - 0) ) {
    return true;
  }
  return false;
}

/**
 * arraySlice
 *
 * @param {array} array
 * @param {number} num
 * @returns {array}*/
export function arraySlice (array, num) {
  const length = Math.ceil(array.length / num);
  return new Array(length).fill().map((_, i) => {
    return array.slice(i * num, (i + 1) * num)
  })
}

/**
 * throttle
 *
 * @param {function} func
 * @param {number} interval
 * @returns {function}
*/
export function throttle (func, interval) {
  let lastTime = Date.now() - interval;
  return () => {
    if ((lastTime + interval) < Date.now()) {
      lastTime = Date.now();
      func();
    }
  }
}

/**
 * debounce
 *
 * @param {function} func
 * @param {number} interval
 * @returns {function}
*/
export function debounce (func, interval) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(func, interval);
  }
}
