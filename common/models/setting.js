module.exports = function (Setting) {
  Setting.validatesUniquenessOf('key', { message: '键值已存在！' });

  Setting.key = function (key, cb) {
  	Setting.findOne({
  		where: { key: key }
  	}, function (err, setting) {
  		cb(err, {
  			value: setting.value
  		})
  	})
  }

  Setting.remoteMethod('key', {
    accepts: [
      { arg: 'key', type: 'string' }
    ],
    returns: { root: true },
    http: { path: '/key', verb: 'post' }
  })
}