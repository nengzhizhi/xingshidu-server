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
    //
    //
    // Interaction.findOne({
    //   status: 'present',
    //   shopId: shopId
    // }, function (err, interaction) {
    //   if (!!err)
    //     return cb(err);
    //
    //   if (!!interaction)
    //     return cb(new Error('直播进行中'));
    //
    //   Interaction.create({
    //     shopId: shopId,
    //     status: 'present',
    //     created: Date.now()
    //   }, cb);
    // })
  }

  Interaction.remoteMethod('start', {
    accepts: [
      { arg: 'shopId', type: 'string' }
    ],
    returns: {arg: 'result', type: 'object'},
    http: { path: '/start', verb: 'post' }
  })

//------------------------------------------------------------------------------
}
