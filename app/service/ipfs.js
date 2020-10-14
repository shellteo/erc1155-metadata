'use strict';

const fleek = require('@fleekhq/fleek-storage-js');
const pinataSDK = require('@pinata/sdk');

const Service = require('egg').Service;

class IpfsService extends Service {
  constructor(ctx, app) {
    super(ctx, app);
    const pinata = pinataSDK(this.config.ss.PINATA_API_KEY, this.config.ss.PINATA_SECRET_API_KEY);
    ctx.pinata = pinata;
  }
  async pinJson(key, body) {
    const ss = this.config.ss;
    const pinata = this.ctx.pinata;
    const service = ss.PINNING_SERVICE || 'pinata';
    const config = {
      apiKey: ss.FLEEK_API_KEY,
      apiSecret: ss.FLEEK_API_SECRET,
    };

    if (service === 'fleek') {
      const input = config;
      input.key = key;
      input.data = JSON.stringify(body);
      const result = await fleek.upload(input);
      return result.hashV0;
    }
    const result = await pinata.pinJSONToIPFS(body);
    return result.IpfsHash;
  }
  async pinFile(file) {
    const pinata = this.ctx.pinata;
    const options = {
      /* pinataMetadata: {
        name: 'MyCustomName',
        keyvalues: {
          customKey: 'customValue',
          customKey2: 'customValue2',
        },
      },
      pinataOptions: {
        cidVersion: 0,
      }, */
    };
    const res = await pinata.pinFileToIPFS(file, options);
    return res;
  }
}

module.exports = IpfsService;
