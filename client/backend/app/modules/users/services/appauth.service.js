(function () {
	'use strict';
	angular
		.module('com.module.users')
		.factory('AppAuth', function ($cookies, $http) {
			var self = {
				login: function(data, cb){
					$http.post('/auth/login', {
						username: 'some username',
						password: 'a password'
					}).then(function (response) {
						$cookies['uid'] = response.data.uid;
						return cb(null, response.data);
					}, function () {
						console.log('Login failed');
						return cb();
					})
				},
				logout: function(cb){
					$http.post('/auth/logout');
					self.currentUser = null;
					return cb(null, null);
				},
				getCurrentUser: function(cb){
					$http.get('/auth/current')
						.then(function (response) {
							self.currentUser = response.data;
							cb(null, self.currentUser);
						}, function () {
							return cb(null, null);
						})
				}
			}

			return self;
		})
})();
