var async = require('async');
var loopback = require('loopback');

module.exports = function (Shop) {
	Shop.detail = function (id, cb) {
		async.waterfall([
			function findShop (next) {
				Shop.findById(id, next);
			}, function interactionStatus (shop, next) {
				if (!shop) {
					return next(new Error('无效的店铺编号！'));
				}
				
				shop.interaction.findOne({
					where: {
						id: shop.interactionId
					}
				}, function (err, instance) {
					next(err, {
						shop: shop, 
						interaction: instance
					});
				})
			}
		], function (err, result) {
			cb(err, result);
		})
	}

  Shop.remoteMethod('detail', {
    accepts: [
      { arg: 'id', type: 'string' }
    ],
    returns: { root: true },
    http: { path: '/detail', verb: 'get' }     
  })
//---------------------------------------------------------------------
  Shop.start = function(id, token, cb){
  	async.waterfall([
  		function validatePermission (next) {
  			Shop.findOne({
  				where: {
  					id: id,
  					token: token
  				}
  			}, next);
  		}, function createInteraction(shop, next) {
				var ctx = loopback.getCurrentContext();
				var user = ctx && ctx.get('currentUser');

				if (!user)
					return cb(new Error('请先登录！'));

				if (!shop)
					return cb(new Error('无效的店铺编号或TOKEN！'))

				Shop.app.models.Interaction.create({
					created: new Date(),
					userId: user && user.userId,
					shopId: shop.id
				}, function (err, interaction) {
					Shop.app.interactionService.startInteraction(interaction.id);
					shop.updateAttributes({
						token: Math.random().toString(),
						status: 'present',
						interactionId: interaction.id
					});

					next(err, {
						shop: shop,
						interaction: interaction
					});				
				})
  		}
  	], function (err, result) {
  		cb(err, result);
  	})
  }

  Shop.remoteMethod('start', {
    accepts: [
      { arg: 'id', type: 'string' },
      { arg: 'token', type: 'string' }
    ],
    returns: { root: true },
    http: { path: '/start', verb: 'get' }
  })
//------------------------------------------------------------------------------
	Shop.close = function(id, token, cb) {
		async.waterfall([
			function findShop(next){
				Shop.findOne({
					where: {
						id: id,
						token: token
					}
				}, next);
			}, function updateShop(shop, next) {
				if (!shop)
					return cb(new Error('无效的店铺编号或TOKEN！'));

				Shop.app.interactionService.closeInteraction(shop.interactionId);
				shop.updateAttributes({
	     		status: 'closed',
					token: Math.random().toString(),
					interactionId: ''
				}, next)
			}
		], function (err, result) {
			cb(err, result);
		})
	}

  Shop.remoteMethod('close', {
    accepts: [
      { arg: 'id', type: 'string' },
      { arg: 'token', type: 'string' }
    ],
    returns: { root: true },
    http: { path: '/close', verb: 'post' }
  })
}