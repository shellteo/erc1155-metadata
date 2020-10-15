'use strict';

const Controller = require('egg').Controller;
const metadataObj = require('../metadata/index');
const contract1155 = require('../metadata/vest.json');

class MetadataController extends Controller {
  async nftItem() {
    const { ctx } = this;
    const { id } = ctx.params;
    const metadata = metadataObj[id] || {
      error: `NFT id ${id} not found`,
    };
    ctx.body = metadata;
  }
  async contractInfo() {
    const { ctx } = this;
    ctx.body = contract1155;
  }
}

module.exports = MetadataController;
