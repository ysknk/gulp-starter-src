// options -> /_app/gulpfile.babel.js/task/config.js
import meta from './page.js'

const ROOT_PATH = ``;
const START_PATH = `/${ROOT_PATH}`;
const FILE_NAME = ``;// default index.html

const ASSETS_PATH = `${START_PATH}assets/`

// const base_dir = {
//   html: `html/`,
//   css: `css/`,
//   js: `js/`,
//   img: `img/`,
//   static: `static/`,
// };

export default {

  tasks: {
    iconfont: true,
    mass_production: false,
  },

  /* common */
  common: {
    // lint: false,// true || gulp --lint
    // minify: false,// true || gulp --min
    delete: true,// false || gulp --del

    // convert: {
    //   linefeedcode: 'LF',// CRLF || LF || CR
    //   replace: [
    //     {from: '〜', to: '～'}
    //   ],
    //   find: ['dev', 'pre', 'test'],
    //   encode: {
    //     to: 'utf8'// https://github.com/ashtuchkin/iconv-lite#supported-encodings
    //   }
    // },

    options: {
      // development | production || none
      mode: 'none',
    },
  },

  /* serv @browserSync */
  serv: {
    options: {
      // port: 8080
      // notify: false,
      // open: 'local',// argv.no = false(ex: gulp watch --no)
      startPath: `${START_PATH}${FILE_NAME}`,
      // ghostMode: false,
      // server: {
      //   baseDir: define.path.dest
        // NOTE: TEST API
        // middleware: [
        //   {
        //     route: "/api",
        //     handle: function (req, res, next) {
        //       const reqPath = req.url.slice(1)
        //       // if (req.method.match(/get/i)) {
        //       // } else {
        //       // }
        //       let result = {
        //         status_code: 404
        //       }

        //       // NOTE: get POST body
        //       req.on('data', function(chunk) {
        //         const jsonstr = chunk.toString()
        //         const body = JSON.parse(jsonstr)

        //         switch (reqPath) {
        //           case '': {
        //             break
        //           }
        //           default: {
        //             break
        //           }
        //         }
        //         res.setHeader('Content-Type', 'application/json; charset=utf-8')
        //         res.end(JSON.stringify(result))
        //         next()
        //       })
        //     }
        //   }
        // ]
      // },
      // rewriteRules: [{
      //   match: /<!--#include virtual="(.+)" -->/g,
      //   // match: /<\?php include DOCUMENT_ROOT \. "(.+)"; \?>/g,
      //   fn: function (req, res, match, filename) {
      //     const filePath = path.resolve(__dirname, `../${define.path.dest}${filename}`);
      //     if (!fs.existsSync(filePath)) {
      //       return `<span style="color: red">${filename} could not be found</span>`;
      //     }
      //     return fs.readFileSync(filePath);
      //   }
      // }],
    }
  },

  /* html @pug */
  html: {
    // src: define.path.src('pug'),
    // src: [`${define.path.srcDir}htdocs/${base_dir.html}**/*.pug`],
    // dest: `${define.path.dest}${ROOT_PATH}`,
    // base_dir: base_dir.html,

    path_type: 'absolute',// relative | absolute
    // ex: https://github.com/kangax/html-minifier/
    // minify_options: {},
    // ex: https://github.com/yaniswang/HTMLHint/wiki/Rules
    // lint_options: {},
    root_path: `${START_PATH}`//base absolute path
  },

  /* css @stylus */
  css: {
    // src: define.path.src('styl'),
    // src: [`${define.path.srcDir}htdocs/${base_dir.css}**/*.styl`],
    // dist: `assets/css/`,
    // dest: define.path.dest,
    // base_dir: base_dir.css,

    // dist: `${ASSETS_PATH}css/`,

    // minify: true,

    // autoprefixer_options: {
    //   browsers: ['last 2 versions', '> 2%'],
    // },
    // ex: https://github.com/CSSLint/csslint/wiki/Rules
    // lint_options: {},
  },

  /* js @webpack */
  js: {
    // src: define.path.src('{js,jsx,ts,tsx,vue}'),
    // src: [`${define.path.srcDir}htdocs/${base_dir.js}**/*.{js,jsx,ts,tsx,vue}`],
    // dist: `assets/js/`,
    // dest: define.path.dest,
    // base_dir: base_dir.js,

    // dist: `${ASSETS_PATH}js/`,

    // minify: true,
    // ex: https://webpack.js.org/plugins/terser-webpack-plugin/
    // minify_options: {},

    // ex: http://eslint.org/docs/rules/
    // lint_options: {},

    // options: {
    //   module: {
    //     rules: [
    //       {
    //         test: /\.(js|jsx|json|vue)$/,
    //         exclude: /node_modules/,
    //         use: {
    //           loader: 'babel-loader?cacheDirectory=true',
    //           options: {
    //             cwd: '../_src/',
    //             presets: [
    //               ['@babel/preset-env', {
    //                 targets: '> 0.25%, not dead',
    //                 useBuiltIns: 'usage',
    //                 corejs: 3,
    //                 // debug: true,
    //               }],
    //               '@babel/preset-react'
    //             ]
    //           }
    //         }
    //       }
    //     ]
    //   },
    //   plugins: [
    //     new webpack.DefinePlugin({
    //       'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    //       'process.env.PRJ_ENV': JSON.stringify(process.env.PRJ_ENV),
    //       meta: {
    //         p: JSON.stringify(meta.p)
    //       }
    //     }),
    //   ]
    // },
  },

  /* img @imagemin */
  img: {
    // src: define.path.src('{jpg,jpeg,png,gif,svg}'),
    // src: [`${define.path.srcDir}htdocs/${base_dir.img}**/*.{jpg,jpeg,png,gif,svg}`],
    // dist: `assets/img/`,
    // dest: define.path.dest,
    // base_dir: base_dir.img,

    // dist: `${ASSETS_PATH}img/`,

    // plugins: [
    //   imageminPngquant({
    //     quality: [0.5, 1.0]
    //   }),
    //   imageminMozjpeg({
    //     quality: 85,
    //     progressive: true
    //   }),
    //   imageminGifsicle(),
    //   imageminOptipng(),
    //   imageminSvgo({
    //     plugins: [
    //       {
    //         name: "preset-default",
    //         params: { overrides: { removeViewBox: false, removeUselessDefs: false } },
    //       }
    //     ]
    //   })
    // ],
    // options: {
    //   interlaced: true,
    //   verbose: true,
    //   progressive: true,
    //   optimizationLevel: 7
    // }
  },

  /* static */
  static: { // other filetype
    // src: define.path.src('!(pug|styl|js|jsx|vue|tag|jpg|jpeg|png|gif|svg|d.ts|ts|tsx)'),
    // src: [`${define.path.srcDir}htdocs/${base_dir.static}**/*.*`],
    // dest: define.path.dest,
    // base_dir: base_dir.static,

    // dist: `${START_PATH}`,
  },

  /* delete */
  delete: { // all
  },

  /* iconfont */
  /* ../tasks/iconfont/src/uF001-hoge1.svg */
  /* ../tasks/iconfont/src/uF002-huga1.svg */
  iconfont: {
    src: [`${define.path.config}tasks/iconfont/**/*.svg`],
    dest: `${define.path.dest}${ASSETS_PATH}font/`,
    options: {
      startUnicode: 0xF001,
      fontName: 'icons1',
      normalize: true,
      fontHeight: 500,
      prependUnicode: true,
      formats: ['ttf', 'eot', 'woff', 'woff2'],
    }
  },

  /* mass_production */
  mass_production: {
    src: [
      `${define.path.htdocs}html/_layouts/**/*`,
      `${define.path.config}tasks/mass_production/src/templates/**/*`
    ],
    dest: `${define.path.dest}${ROOT_PATH}`,

    templateDir: `${define.path.config}tasks/mass_production/src/templates/`,
    contextDir: `${define.path.config}tasks/mass_production/src/index.js`,

    extension: '.html',

    options: {
      pretty: true
    },

    meta,

    root_path: `${START_PATH}`,//base path
    htdocsdir: define.path.htdocs
  }
};

