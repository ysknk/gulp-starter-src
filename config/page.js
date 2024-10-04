import data from './data/index.js'
// delete require.cache[require.resolve('./data')]

const site_name = ``;
const separator = ` | `;
const title = `common title`;
const description = `common description`;
const url = ``;

const head = {
  lang: 'ja',
  dir: 'ltr',
  charset: 'utf-8',

  // canonical: `${url}`,

  // favicon: '/favicon.ico',
  // apple_touch_icon: [
  //   {
  //     rel: 'apple-touch-icon-precomposed',
  //     sizes: '180x180',
  //     href: '/apple-touch-icon.png'
  //   },
  //   {
  //     rel: 'apple-touch-icon-precomposed',
  //     href: '/apple-touch-icon.png'
  //   }
  // ],

  // content_security_policy: "default-src 'self'; img-src https://*; child-src 'none';",
  x_ua_compatible: 'IE=edge',
  // robots: 'noindex,nofollow',

  format_detection: 'telephone=no',
  viewport: 'width=device-width,initial-scale=1,shrink-to-fit=no', // or -> width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no

  title,
  description,
  keywords: 'common keywords',

  css: ['style.css'],
  js: ['script.js'],

  // og: {
  //   site_name,
  //   locale: `ja_JP`,
  //   type: `article`,
  //   url: `${url}`,
  //   title,
  //   description,
  // },
  // twitter: {
  //   card: `summary_large_image`,
  // }
};

// class_name prefix
const prefix_layout = 'l-';
const prefix_component = 'c-';
const prefix_site = prefix_component;

export default {
  ...head,

  data,
  breakpoint: 780,

  p: {
    s: prefix_site,
    l: prefix_layout,
    c: prefix_component
  },

  page_name: 'common-page',

  // /^\// -> directory
  // /^$/ -> file
  '$index': {
    title: 'top title',
    description: 'top description',
    keywords: 'top keywords',
    js: [...head.js, 'pages/top.js'],
    // og: Object.assign({}, head.og, {
    //   type: `website`,
    //   title: 'top title',
    //   description: 'top description',
    // }),
    page_name: 'top-page',
    extension: '.html'
  },
};

