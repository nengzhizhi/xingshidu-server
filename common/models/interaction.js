var async = require('async');
var _ = require('lodash');

module.exports = function (Interaction) {
  Interaction.validatesInclusionOf('status', { in: ['present', 'closed'] });

  Interaction.start = function (shopId, cb) {
    async.waterfall([
      function findCurrentInteraction (next) {
        Interaction.findOne({
          status: 'present',
          shopId: shopId
        }, next);
      }, function findShop (interaction, next) {
        if (!!interaction)
          return cb(new Error('直播进行中'));

        Interaction.app.models.Shop.findOne({ id: shopId }, next);
      }, function createInteraction(shop, next) {
        if (!shop)
          return cb(new Error('无效的shop id'));

        shop.interaction.create({
          status: 'present',
          created: Date.now()
        }, next);
      }
    ], function (err, result) {
      cb(err, result);
    })
  }

  Interaction.remoteMethod('start', {
    accepts: [
      { arg: 'shopId', type: 'string' }
    ],
    returns: {arg: 'result', type: 'object'},
    http: { path: '/start', verb: 'post' }
  })
//------------------------------------------------------------------------------
  Interaction.close = function (id, cb) {
    async.waterfall([
      function findInteraction (next) {
        Interaction.findOne({ id: id }, next);
      }, function updateInteraction (instance, next) {
        if (!!instance) {
          instance.updateAttribute('status', 'closed', next);
          Interaction.app.closeInteraction(instance.id);
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
    returns: { arg: 'result', type: 'object' },
    http: { path: '/close', verb: 'post' }
  })
//---------------------------------------------------------------------------------

  Interaction.serviceUsers = function (id, cb) {
    cb(null, {
      users: Interaction.app.getUsers()
    });
  }

  Interaction.remoteMethod('serviceUsers', {
    accepts: [
      { arg: 'id', type: 'string' }
    ],
    returns: { arg: 'result', type: 'object' },
    http: { path: '/serviceUsers', verb: 'post' }
  })

}
