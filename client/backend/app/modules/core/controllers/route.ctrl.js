(function(){
	'use strict';
	angular
		.module('com.module.core')
		.controller('RouteCtrl', function (UserService, $location) {
			UserService.currentUser(function (user) {
				$location.path('/app');
			}, function (err) {
				$location.path('/login');
			})
		})
})();
