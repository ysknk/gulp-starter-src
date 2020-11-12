import variable from './_partials/globals/variable';

import plugins from './_partials/plugins/';

import raf from './_partials/shared_classes/raf';

import device from './_partials/shared_classes/device';
import mediaQuery from './_partials/shared_classes/mediaQuery';
import ajax from './_partials/shared_classes/ajax';
import smoothScroll from './_partials/shared_classes/smoothScroll';
import accordion from './_partials/shared_classes/accordion';
import modal from './_partials/shared_classes/modal';
import tab from './_partials/shared_classes/tab';
// import pageShare from './_partials/shared_classes/pageShare';
// import expander from './_partials/shared_classes/expander';
// import ellipsis from './_partials/shared_classes/ellipsis';
// import countdown from './_partials/shared_classes/countdown';
// import anchorNav from './_partials/shared_classes/anchorNav';
// import parallax from './_partials/shared_classes/parallax';
import intersection from './_partials/shared_classes/intersection';
// import preventDuplicateSubmit from './_partials/classes/preventDuplicateSubmit';
// import mouseStalker from './_partials/shared_classes/mouseStalker';

/**
 * common initialize
 */
((win, doc) => {
  'use strict';

  const FN = win[NS];

  FN.detectUseStyle = plugins.detectUseStyle;

  FN.uaParser = new plugins.uaParserJs();
  FN.axios = plugins.axios;
  FN.anime = plugins.anime;
  // FN.gsap = plugins.gsap;
  // FN.cookies = plugins.cookies;

  // plugins.moment.tz.setDefault('Asia/Tokyo');
  // FN.moment = plugins.moment;

  // device
  FN.device = new device();

  const html = doc.documentElement;
  html.classList.remove('no-js');

  // html class
  if (FN.device.isPc()) {
    html.classList.add('device-media-pc');
  }
  if (FN.device.isSp() && !FN.device.isTab()) {
    html.classList.add('device-media-sp');
  }
  if (FN.device.isTab()) {
    html.classList.add('device-media-tab');
  }
  if (FN.device.isTouch()) {
    html.classList.add('device-use-touch');
  } else {
    html.classList.add('device-use-mouse');
  }

  // if (!detectUseStyle('position', 'sticky')) {
  //   html.classList.add('no-sticky');
  // }

  // mediaquery
  FN.mediaQuery = new mediaQuery();

  // ajax
  FN.ajax = new ajax();

  // raf
  // FN.raf = new raf();
  // FN.raf.update();

  // scroll
  FN.scroll = new smoothScroll();
  FN.scroll.initialize();

  // accordion
  FN.accordion = new accordion();
  FN.accordion.initialize();

  // modal
  FN.modal = new modal();
  FN.modal.initialize();

  // tab
  FN.tab = new tab();
  FN.tab.initialize();

  // pageShare
  // FN.pageShare = new pageShare();
  // FN.pageShare.initialize();

  // expander
  // FN.expander = new expander();
  // FN.expander.initialize();

  // ellipsis
  // FN.ellipsis = new ellipsis();

  // countdown
  // FN.countdown = new countdown();

  // anchorNav
  // FN.anchorNav = new anchorNav();

  // parallax
  // FN.parallax = new parallax();

  // intersection
  FN.intersection = new intersection();

  // preventDuplicateSubmit
  // FN.preventDuplicateSubmit = new preventDuplicateSubmit();

  // mouseStalker
  // FN.mouseStalker = new mouseStalker();
  // FN.mouseStalker.initialize();

  /**
   * event procedure
   */
  doc.addEventListener('DOMContentLoaded', (e) => {
    FN.mediaQuery.update();
    FN.accordion.setClose();
    FN.tab.setActive();
    // FN.expander.updateAll();
    // FN.ellipsis.updateAll();
    // FN.countdown.update();
    // FN.anchorNav.update();
    // FN.parallax.update();
    FN.intersection.initialize();
    FN.intersection.update();
  }, false);

  win.addEventListener('load', (e) => {
    FN.scroll.locationHref();
  }, false);

  win.addEventListener('resize', (e) => {
    FN.mediaQuery.update();
    // FN.modal.update();
    // FN.parallax.update();
  }, false);

  win.addEventListener('resize', _.debounce((e) => {
    // FN.anchorNav.update();
    FN.intersection.update();
  }, 100), false);

  // win.addEventListener('scroll', (e) => {
  // }, false);

  win.addEventListener('scroll', _.throttle((e) => {
    // FN.modal.update();
    // FN.anchorNav.update();
    // FN.parallax.update();
    FN.intersection.update();
  }, 100), true);

})(window, document);

