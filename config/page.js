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

  x_ua_compatible: 'IE=edge',
  robots: '',
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

module.exports = {
  ...head,

  p: 'site-', // class_name prefix

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

