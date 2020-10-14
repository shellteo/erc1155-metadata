'use strict';
const Service = require('egg').Service;

class VoteService extends Service {
  async storeRedis(space, body, authorIpfsHash, relayerIpfsHash) {
    const msg = JSON.parse(body.msg);
    await this.app.redis.hmset(
      `token:${space}:proposal:${msg.payload.proposal}:votes`,
      body.address,
      JSON.stringify({
        address: body.address,
        msg,
        sig: body.sig,
        authorIpfsHash,
        relayerIpfsHash,
      })
    );
  }
  async storeMysql(space, body, authorIpfsHash, relayerIpfsHash) {
    const msg = JSON.parse(body.msg);
    const query = 'INSERT IGNORE INTO messages SET ?;';
    await this.app.mysql.query(query, [{
      id: authorIpfsHash,
      address: body.address,
      version: msg.version,
      timestamp: msg.timestamp,
      token: space,
      type: 'vote',
      payload: JSON.stringify(msg.payload),
      sig: body.sig,
      metadata: JSON.stringify({
        relayer_ipfs_hash: relayerIpfsHash,
      }),
    }]);
  }
}

module.exports = VoteService;
