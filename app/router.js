'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { controller, router } = app;
  router.get('/', controller.home.index);
  router.get('/contract/memes-erc1155', controller.metadata.contractInfo);
  router.get('/memes/:id', controller.metadata.nftItem);
};
