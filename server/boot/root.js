module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);

  // router.post('/weixin/callback', function (req, res, next) {
  // 	console.log('auth account');
  // 	next();
  // })
};
