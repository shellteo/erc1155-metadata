'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { controller, router } = app;
  router.get('/api/', controller.home.index);
};
