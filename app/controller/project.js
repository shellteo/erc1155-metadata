'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');

class TokenController extends Controller {
  async list() {
    const { ctx } = this;
    const { pageindex = 1, pagesize = 10 } = ctx.query;
    const result = await this.service.project.getProjectList(pageindex, pagesize);
    ctx.body = result;
  }
  async item() {
    const { ctx } = this;
    const { id, address } = ctx.query;
    let result = {};
    if (id) {
      result = await this.service.project.getProjectById(id);
    } else {
      result = await this.service.project.getProjectByAddress(address);
    }
    ctx.body = result;
  }
  async create() {
    const { ctx } = this;
    const { baseInfo = {}, miningInfo = [], resourceInfo = [] } = ctx.request.body;
    const result = await this.service.project.create(baseInfo, miningInfo, resourceInfo);
    ctx.body = result;
  }
  async update() {
    const { ctx } = this;
    const { baseInfo = {}, miningInfo = [], resourceInfo = [] } = ctx.request.body;
    const result = await this.service.project.update2(baseInfo, miningInfo, resourceInfo);
    ctx.body = result;
  }
  async uploadFile() {
    const { ctx } = this;
    console.log(ctx.request.files);
    const file = ctx.request.files[0];
    const readableStreamForFile = fs.createReadStream(file.filepath);
    const result = await this.service.ipfs.pinFile(readableStreamForFile);
    await fs.unlinkSync(file.filepath);
    ctx.body = result;
  }
}

module.exports = TokenController;
