(function(){
	'use strict';
	angular
		.module('com.module.core')
		.controller('RouteCtrl', function (ApiService, User, $location) {
			User.getCurrent(function (currentUser) {
				$location.path('/app');
			}, function () {
				$location.path('/login');
			});
		})
})();
