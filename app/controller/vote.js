'use strict';

const Controller = require('egg').Controller;
const pkg = require('../../package.json');

class VoteController extends Controller {
  async index() {
    const { ctx } = this;
    const { address, sig } = ctx.request.body;
    const body = { msg: ctx.request.body.msg, address, sig };
    const relayer = this.app.relayer;
    const ts = (Date.now() / 1e3).toFixed();
    const msg = ctx.helper.jsonParse(ctx.request.body.msg);
    if (!address || !msg || !sig) return this.sendError('wrong message body');
    if (
      Object.keys(msg).length !== 5 ||
      !msg.token ||
      !msg.payload ||
      Object.keys(msg.payload).length === 0
    ) return this.sendError('wrong signed message');
    if (!msg.timestamp || typeof msg.timestamp !== 'string' || msg.timestamp > ts) return this.sendError('wrong timestamp');
    if (!msg.version || msg.version !== pkg.version) return this.sendError('wrong version');
    if (!msg.type || ![ 'proposal', 'vote' ].includes(msg.type)) return this.sendError('wrong message type');
    if (!await ctx.helper.verify(body.address, body.msg, body.sig)) return this.sendError('wrong signature');

    if (msg.type === 'proposal') {
      if (
        Object.keys(msg.payload).length !== 7 ||
        !msg.payload.choices ||
        msg.payload.choices.length < 2 ||
        !msg.payload.snapshot ||
        !msg.payload.metadata
      ) return this.sendError('wrong proposal format');

      if (
        !msg.payload.name ||
        msg.payload.name.length > 256 ||
        !msg.payload.body ||
        msg.payload.body.length > 4e4
      ) return this.sendError('wrong proposal size');

      if (
        typeof msg.payload.metadata !== 'object' ||
        JSON.stringify(msg.payload.metadata).length > 2e4
      ) return this.sendError('wrong proposal metadata');

      if (
        !msg.payload.start ||
        // ts > msg.payload.start ||
        !msg.payload.end ||
        msg.payload.start >= msg.payload.end
      ) return this.sendError('wrong proposal period');
    }

    if (msg.type === 'vote') {
      if (
        Object.keys(msg.payload).length !== 3 ||
        !msg.payload.proposal ||
        !msg.payload.choice ||
        !msg.payload.metadata
      ) return this.sendError('wrong vote format');

      if (
        typeof msg.payload.metadata !== 'object' ||
        JSON.stringify(msg.payload.metadata).length > 1e4
      ) return this.sendError('wrong vote metadata');

      const proposalRedis = await this.app.redis.hget(`token:${msg.token}:proposals`, msg.payload.proposal);
      const proposal = ctx.helper.jsonParse(proposalRedis);
      if (!proposalRedis) return this.sendError('unknown proposal');
      if (
        ts > proposal.msg.payload.end ||
        proposal.msg.payload.start > ts
      ) return this.sendError('not in voting window');
    }

    const authorIpfsRes = await this.service.ipfs.pinJson(`snapshot/${sig}`, {
      address: body.address,
      msg: body.msg,
      sig: body.sig,
      version: '2',
    });

    const relayerSig = await relayer.signMessage(authorIpfsRes);
    const relayerIpfsRes = await this.service.ipfs.pinJson(`snapshot/${relayerSig}`, {
      address: relayer.address,
      msg: authorIpfsRes,
      sig: relayerSig,
      version: '2',
    });

    if (msg.type === 'proposal') {
      await Promise.all([
        this.service.proposal.storeRedis(msg.token, body, authorIpfsRes, relayerIpfsRes),
        this.service.proposal.storeMysql(msg.token, body, authorIpfsRes, relayerIpfsRes),
      ]);
    }

    if (msg.type === 'vote') {
      await Promise.all([
        this.service.vote.storeRedis(msg.token, body, authorIpfsRes, relayerIpfsRes),
        this.service.vote.storeMysql(msg.token, body, authorIpfsRes, relayerIpfsRes),
      ]);
    }

    console.log(
      `Address "${address}"\n`,
      `Token "${msg.token}"\n`,
      `Type "${msg.type}"\n`,
      `IPFS hash "${authorIpfsRes}"`
    );
    ctx.body = { ipfsHash: authorIpfsRes };
  }
  sendError(description) {
    this.ctx.status = 500;
    this.ctx.body = {
      error: 'unauthorized',
      error_description: description,
    };
  }
}

module.exports = VoteController;
