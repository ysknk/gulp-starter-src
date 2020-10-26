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
 * @param {object} elem element
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
export function getURLQuery(param, url) {
  if (!param) return;
  if (!url) url = location.href;
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
export function kebabToCamel (str) {
  str = str.charAt(0).toLowerCase() + str.slice(1);
  return str.replace(/[-_](.)/g, function(match, headStr) {
    return headStr.toUpperCase();
  });
}
