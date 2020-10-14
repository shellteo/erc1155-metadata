'use strict';

const Controller = require('egg').Controller;
const pkg = require('../../package.json');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = {
      name: pkg.name,
      version: pkg.version,
    };
  }
}

module.exports = HomeController;
