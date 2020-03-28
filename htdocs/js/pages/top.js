((win, doc) => {
  'use strict';

  const FN = win[NS];
  const PAGE_NAME = `${PREFIX}top-page`;

  function isCurrentPage() {
    return doc.querySelector(`.${PAGE_NAME}`) || ``
  }

  function initialize() {}

  doc.addEventListener('DOMContentLoaded', (e) => {
    if (!isCurrentPage()) return;
    initialize();
  }, false);

})(window, document);

