export default ((win, doc) => {
  'use strict';

  const PREFIX = 'site-';
  if (win['PREFIX']) {
    console.error(`window.PREFIX [${PREFIX}] dupricated.`);
  } else {
    win['PREFIX'] = PREFIX;
  }

  const NS = '$';
  if (win['NS']) {
    console.error(`window.NS dupricated.`);
  } else {
    win['NS'] = NS;

    if (win[NS]) {
      console.error(`window.${NS} dupricated.`);
    } else {
      win[NS] = {};
    }
  }

  // lodash minimal add
  if (win['_']) {
    console.error(`window._ dupricated.`);
  } else {
    win['_'] = {
      merge: require('lodash/merge'),
      extend: require('lodash/extend'),
      forEach: require('lodash/forEach'),
      template: require('lodash/template'),
      isObject: require('lodash/isObject'),
      isFunction: require('lodash/isFunction'),
      throttle: require('lodash/throttle'),
      debounce: require('lodash/debounce'),
      orderBy: require('lodash/orderBy')
    };
  }

})(window, document);

