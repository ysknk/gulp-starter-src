'use strict';

import { default as TaskMaster } from '../../../../_app/gulpfiles/task/master.js';
import { execSync } from 'child_process'

/**
 * Set Const Variables
 */
const config = global[define.ns];

/**
 * Set Variables
 */
const task = {
  name: 'iconfont',
  types: []// **:watch function [0] || 'proc'
};

/**
 * Iconfont
 */
class Iconfont extends TaskMaster {

  /**
   * constructor
   *
   * @param {object} opts_
   */
  constructor(opts_) {
    super(opts_);
  }

  /**
   * procedure
   * watch or build
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  build (stream, done) {
    execSync(`cd ../_src/ && npm run fonticon`, { stdio: 'inherit' })
    done && done()
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

export default new Iconfont(task);
