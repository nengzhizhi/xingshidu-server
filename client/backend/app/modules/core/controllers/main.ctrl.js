(function(){
	'use strict';
	angular
		.module('com.module.core')
		.controller('MainCtrl', function ($scope, $rootScope, $q, UserService, $location) {
			UserService.currentUser(function (user) {
				$scope.currentUser = user;
				$scope.menuoptions = $rootScope.menu;
			}, function (err) {
				$location.path('/login');
			})
		});
})();
