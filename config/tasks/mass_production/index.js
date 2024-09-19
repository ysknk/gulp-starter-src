'use strict';

import { default as TaskMaster } from '../../../../_app/gulpfiles/task/master.js';
import plugin from '../../../../_app/gulpfiles/plugins/pug/index.js';

/**
 * Set Const Variables
 */
// const config = global[define.ns];

/**
 * Set Variables
 */
const task = {
  name: 'mass_production',
  types: ['build']// **:watch function [0] || 'proc'
};

/**
 * MassProduction
 */
class MassProduction extends TaskMaster {

  /**
   * constructor
   *
   * @param {object} opts_
   */
  constructor(opts_) {
    super(opts_);
  }

  /**
   * initialize
   */
  initialize() {
    let htdocsdir = {
      basedir: this.task.data.htdocsdir
    };

    this.task.data.options = _.merge({},
      htdocsdir,
      this.task.data.options
    );
  }

  /**
   * procedure
   * watch or build
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  build (stream, done) {
    (async () => {
      const time = new Date().getTime() // NOTE: no cahce
      const contextsImport = await import(`${path.resolve(this.task.data.contextDir)}?${time}`)
      const contexts = contextsImport.default

      for (const key in contexts) {

        const context = contexts[key];
        const {dest, extname} = this.getDest(context);
        const template = path.resolve(`${this.task.data.templateDir}${key}.pug`);
        const contents = context && context.contents ? context.contents : context

        switch (key) {
          case 'tests': {
            const indexTemplate = path.resolve(`${this.task.data.templateDir}${key.split(/s$/)[0]}.pug`);
            contents.forEach((parent) => {
              const parentSlug = parent.slug || '';
              const {filename, slug} = this.getPath(parentSlug)

              this.createPage({
                dest: `${dest}${slug}`,
                filename: `${filename}${extname}`,
                template: indexTemplate,
                context: parent,
              });

              parent.list.forEach((child) => {
                const childSlug = child.slug;
                child.slug = `${parentSlug}${childSlug}`;
                const {filename, slug} = this.getPath(child.slug);

                this.createPage({
                  dest: `${dest}${slug}`,
                  filename: `${filename}${extname}`,
                  template,
                  context: child
                });
                // console.log(`Create: ${dest}${slug}index${extname}`);
              });
            });
            break;
          }

          default: {
            contents.forEach((page) => {
              if (!page.slug) { return; }

              const {filename, slug} = this.getPath(page.slug)

              this.createPage({
                dest: `${dest}${slug}`,
                filename: `${filename}${extname}`,
                template,
                context: page
              });
            });
            break;
          }
        }

        done && done()
      }
    })();
  }

  /**
   * getPath
   *
   * @param {string} slug
   * @returns {object}
   */
  getPath(slug) {
    const lastdir = slug.match(/\/(.*)$/);
    const lastslash = slug.match(/\/$/);

    let filename = `index`;

    if (!lastslash) {
      if (lastdir) {
        filename = lastdir[1];
        slug = slug.replace(lastdir[1], '');
      } else {
        filename = slug;
        slug = '';
      }
    }

    return {
      filename,
      slug
    }
  }

  /**
   * createPage
   *
   * @param {object}
   */
  createPage({dest, filename, template, context}) {
    const context_data = {
      data: context
    };

    gulp.src(template, {allowEmpty: true})
      .pipe($.plumber(this.errorMessage()))
      .pipe($.rename(filename))
      .pipe($.data(() => {
        return this.setData(context_data)
      }))

      .pipe(plugin(this.task.data.options))
      .pipe(plugins.useful(this.task.data.convert))
      .pipe(gulp.dest(dest))

      .pipe($.size(this.sizeOptions()))
      .pipe(plugins.log())
      .pipe(this.serv());
  }

  /**
   * getDest
   *
   * @param {object}
   * @returns {object}
   */
  getDest({destDir, extname, dest}) {
    destDir = (destDir ? destDir + '/' : '');
    return {
      extname: (extname || this.task.data.extension),
      dest: dest ? (dest + destDir) : (this.task.data.dest + destDir)
    };
  }

  /**
   * setData
   *
   * @param {object} context
   * @returns {object}
   */
  setData(context) {
    context.data = _.merge({},
      this.task.data.meta,
      context.data
    );
    context.data.root_path = this.task.data.root_path;
    return context.data;
  }

  /**
   * setTask
   */
  setTask() {
    let defaultTask = this.task.types && this.task.types.length ?
      this.task.types[0] : 'procedure';
    let src = this.task.data.src;
    let mergeSrc = [...src];

    // default task
    gulp.task(this.task.name, (done) => {
      this[defaultTask](gulp.src(src, {allowEmpty: true}), done);
    });

    // watch task
    gulp.task(this.task.name + ':watch', () => {
      this.watch(this.task, mergeSrc);
    });

    // other types task
    _.forEach(this.task.types, (type) => {
      if(!this[type]) return;
      gulp.task(this.task.name + ':' + type, (done) => {
        this[type](gulp.src(src, {allowEmpty: true}), done);
      });
    });
  }

}

export default new MassProduction(task);
