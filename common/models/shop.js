var async = require('async');

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
						status: 'present'
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
}