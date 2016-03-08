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
          Interaction.app.interactionService.setInteractionCreater(interaction.id, user.userId);

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
        Interaction.findOne({ 
          where: { id: id }
        }, next);
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
    var users = Interaction.app.interactionService.getUsers(id);
    console.log('users: ', users);
    return cb(null, users);
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
    var userIdentityModel = Interaction.app.models.userIdentity;

    async.waterfall([
      function findInteraction (next) {
        Interaction.findOne({
          where: { id: id },
          include: 'shop'
        }, next);
      }, function getUserProfile(interaction, next) {
        if (!interaction || !interaction.userId) {
          return next(new Error('无效的id!'));
        }

        userIdentityModel.findOne({
          where: { userId: interaction.userId }
        }, function (err, userIdentity) {
          if (!!userIdentity && !!userIdentity.provider && !!userIdentity.profile) {
            if (userIdentity.provider == 'weixin') {
              interaction.__data.creater = {
                nickname: userIdentity.profile.nickname,
                headimgurl: userIdentity.profile.headimgurl
              }
            }
          }
          next(err, interaction);
        })
      }
    ], function (err, result) {
      cb(err, result);
    })
  }

  Interaction.remoteMethod('detail', {
    accepts: [
      { arg: 'id', type: 'string' }
    ],
    returns: { root: true },
    http: { path: '/detail', verb: 'post' }
  })
}
