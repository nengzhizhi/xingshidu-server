var async = require('async');
var _ = require('lodash');
var loopback = require('loopback');

module.exports = function (Interaction) {
  Interaction.validatesInclusionOf('status', { in: ['present', 'closed'] });

  Interaction.start = function (shopId, cb) {
    async.waterfall([
      function findCurrentInteraction (next) {
        Interaction.findOne({
          where: {
            status: 'present',
            shopId: shopId
          }
        }, next);
      }, function findShop (interaction, next) {
        if (!!interaction)
          return cb(new Error('直播进行中'));

        Interaction.app.models.Shop.findOne({ 
          where: { id: shopId }
        }, next);
      }, function createInteraction(shop, next) {
        if (!shop)
          return cb(new Error('无效的shop id'));

        var ctx = loopback.getCurrentContext();
        var user = ctx && ctx.get('currentUser');

        if (!user)
          return cb(new Error('请先登录！'));

        shop.interaction.create({
          status: 'present',
          created: new Date(),
          userId: user && user.userId
        }, function (err, interaction) {
          next(err, {
            interaction: interaction,
            shop: shop
          });
        });
      }
    ], function (err, result) {
      cb(err, result);
    })
  }

  Interaction.remoteMethod('start', {
    accepts: [
      { arg: 'shopId', type: 'string' }
    ],
    returns: { root: true },
    http: { path: '/start', verb: 'get' }
  })
//------------------------------------------------------------------------------
  Interaction.close = function (id, cb) {
    async.waterfall([
      function findInteraction (next) {
        Interaction.findOne({ id: id }, next);
      }, function updateInteraction (instance, next) {
        if (!!instance) {
          instance.updateAttributes({
            status: 'closed',
            closed: new Date()
          }, next);
          Interaction.app.interactionService.closeInteraction(instance.id);
        }
      }//TODO 关闭socketIO
    ], function (err, result) {
      cb(err, result);
    })
  }

  Interaction.remoteMethod('close', {
    accepts: [
      { arg: 'id', type: 'string' }
    ],
    returns: { root: true },
    http: { path: '/close', verb: 'post' }
  })
//---------------------------------------------------------------------------------
  Interaction.serviceUsers = function (id, cb) {
    return cb(null, Interaction.app.interactionService.getUsers(id));
  }

  Interaction.remoteMethod('serviceUsers', {
    accepts: [
      { arg: 'id', type: 'string' }
    ],
    returns: { arg: 'users', type: 'array' },
    http: { path: '/serviceUsers', verb: 'post' }
  })
//----------------------------------------------------------------------------------  
  Interaction.detail = function (id, cb) {
    Interaction.findOne({
      where: { id: id },
      include: 'shop'
    }, cb);
  }

  Interaction.remoteMethod('detail', {
    accepts: [
      { arg: 'id', type: 'string' }
    ],
    returns: { root: true },
    http: { path: '/detail', verb: 'post' }
  })
}
