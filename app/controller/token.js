'use strict';

const Controller = require('egg').Controller;

class TokenController extends Controller {
  async list() {
    const { ctx } = this;
    const { token } = ctx.params;
    let proposals = await this.app.redis.hgetall(`token:${token}:proposals`);
    console.log(proposals);
    if (!proposals) {
      ctx.body = {};
      return;
    }
    proposals = Object.fromEntries(Object.entries(proposals).map(proposal => {
      proposal[1] = JSON.parse(proposal[1]);
      return proposal;
    }));
    ctx.body = proposals;
  }
  async item() {
    const { ctx } = this;
    const { token, id } = ctx.params;
    let votes = await this.app.redis.hgetall(`token:${token}:proposal:${id}:votes`) || {};
    console.log(votes);
    if (votes) {
      votes = Object.fromEntries(Object.entries(votes).map(vote => {
        vote[1] = JSON.parse(vote[1]);
        return vote;
      }));
    }
    ctx.body = votes;
  }
}

module.exports = TokenController;
