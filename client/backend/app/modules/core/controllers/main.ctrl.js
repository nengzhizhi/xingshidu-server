(function(){
	'use strict';
	angular
		.module('com.module.core')
		.controller('MainCtrl', function ($scope, $rootScope, $q, User, $location) {
			User.getCurrent(function (currentUser) {
				$scope.currentUser = currentUser;
				$scope.menuoptions = $rootScope.menu;
			}, function () {
				$location.path('/login');
			});
		});
})();
