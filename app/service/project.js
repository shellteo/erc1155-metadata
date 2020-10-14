'use strict';
const Service = require('egg').Service;

class ProjectService extends Service {
  async getProjectList(pi = 1, pz = 10) {
    const offset = (parseInt(pi) - 1) * parseInt(pz);
    const limit = parseInt(pz);
    const list = await this.app.mysql.select('project', {
      orders: [[ 'id', 'desc' ]],
      limit,
      offset,
    });
    const count = await this.app.mysql.count('project');
    return {
      list,
      count,
    };
  }
  async getProjectById(id) {
    const item = await this.app.mysql.select('project', {
      where: { id },
    });
    if (item.length <= 0) return {};
    const resource = await this.app.mysql.select('resource', {
      where: { pid: id },
    });
    const mining = await this.app.mysql.select('mining', {
      where: { pid: id },
    });
    const project = item[0];
    const space = this.getSpaceJson(project);
    console.log('space: ', space);
    return {
      ...project,
      resource,
      mining,
      space,
    };
  }
  async getProjectByAddress(address) {
    const item = await this.app.mysql.select('project', {
      where: { contract_address: address },
    });
    if (item.length <= 0) return {};
    const id = item[0].id;
    const resource = await this.app.mysql.select('resource', {
      where: { pid: id },
    });
    const mining = await this.app.mysql.select('mining', {
      where: { pid: id },
    });
    const project = item[0];
    const space = this.getSpaceJson(project);
    console.log('space: ', space);
    return {
      ...project,
      resource,
      mining,
      space,
    };
  }
  async create(baseInfo = {}, miningInfo = [], resourceInfo = []) {
    const conn = await this.app.mysql.beginTransaction();
    try {
      const {
        blockchain = 'ethereum',
        name,
        logo,
        brief,
        intro,
        contract_address,
        contract_totalsupply,
        contract_audit,
        contract_audit_report,
        website,
        sort,
      } = baseInfo;
      const insertProject = await conn.insert('project', {
        blockchain,
        name,
        logo,
        brief,
        intro,
        contract_address,
        contract_totalsupply,
        contract_audit,
        contract_audit_report,
        website,
        sort,
      });
      const pid = insertProject.insertId;
      if (miningInfo.length > 0) {
        for (const item of miningInfo) {
          item.pid = pid;
        }
        const miningResult = await conn.insert('mining', miningInfo);
        console.log(miningResult);
      }
      if (resourceInfo.length > 0) {
        for (const item of resourceInfo) {
          item.pid = pid;
        }
        const resourceResult = await conn.insert('resource', resourceInfo);
        console.log(resourceResult);
      }
      conn.commit();
      return pid;
    } catch (error) {
      this.ctx.logger.error('service project create error: ', error);
      await conn.rollback();
      return -1;
    }
  }
  async update(baseInfo = {}, miningInfo = [], resourceInfo = []) {
    const conn = await this.app.mysql.beginTransaction();
    try {
      await conn.update('project', baseInfo);
      const pid = baseInfo.id;
      // update mining table
      if (miningInfo.length > 0) {
        const updates = [];
        const creates = [];
        const deletes = [];
        for (const item of miningInfo) {
          item.pid = pid;
          if (item.delete && item.id) deletes.push(item.id);
          else if (item.id) updates.push(item);
          else creates.push(item);
        }
        // update
        if (updates.length > 0) await conn.updateRows('mining', updates);
        // insert
        if (creates.length > 0) await conn.insert('mining', creates);
        // delete rows
        if (deletes.length > 0) await conn.query('DELETE FROM mining WHERE id IN (:deletes);', { deletes });
      }
      // update resource table
      if (resourceInfo.length > 0) {
        const updates = [];
        const creates = [];
        const deletes = [];
        for (const item of resourceInfo) {
          item.pid = pid;
          if (item.delete && item.id) deletes.push(item.id);
          else if (item.id) updates.push(item);
          else creates.push(item);
        }
        // update
        if (updates.length > 0) await conn.updateRows('resource', updates);
        // insert
        if (creates.length > 0) await conn.insert('resource', creates);
        // delete rows
        if (deletes.length > 0) await conn.query('DELETE FROM resource WHERE id IN (:deletes);', { deletes });
      }
      conn.commit();
      return pid;
    } catch (error) {
      this.ctx.logger.error('service project create error: ', error);
      await conn.rollback();
      return -1;
    }
  }
  async update2(baseInfo = {}, miningInfo = [], resourceInfo = []) {
    const conn = await this.app.mysql.beginTransaction();
    try {
      await conn.update('project', baseInfo);
      const pid = baseInfo.id;
      // delete
      await conn.query(`
        DELETE FROM mining WHERE pid = :pid;
        DELETE FROM resource WHERE pid = :pid;`, { pid });
      // insert
      if (miningInfo.length > 0) {
        for (const item of miningInfo) {
          item.pid = pid;
          delete item.id;
        }
        await conn.insert('mining', miningInfo);
      }
      // insert
      if (resourceInfo.length > 0) {
        for (const item of resourceInfo) {
          item.pid = pid;
          delete item.id;
        }
        await conn.insert('resource', resourceInfo);
      }
      conn.commit();
      return pid;
    } catch (error) {
      this.ctx.logger.error('service project create error: ', error);
      await conn.rollback();
      return -1;
    }
  }
  getSpaceJson(project) {
    const address = project.contract_address;
    const name = project.name;
    return {
      key: name,
      name,
      chainId: 1,
      decimals: 18,
      symbol: name,
      defaultView: 'all',
      address,
      token: address,
      core: [],
      min: 1,
      invalid: [],
      strategies: [],
    };
  }
}

module.exports = ProjectService;
