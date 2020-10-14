'use strict';

const { verifyMessage } = require('@ethersproject/wallet');

module.exports = {
  jsonParse(input, fallback) {
    try {
      return JSON.parse(input);
    } catch (err) {
      return fallback || {};
    }
  },
  async verify(address, msg, sig) {
    console.log(address, msg, sig);
    const recovered = await verifyMessage(msg, sig);
    return recovered === address;
  },
  clone(item) {
    return JSON.parse(JSON.stringify(item));
  },
  sendError(res, description) {
    return res.status(500).json({
      error: 'unauthorized',
      error_description: description,
    });
  },
};
