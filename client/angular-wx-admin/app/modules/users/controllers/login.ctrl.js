(function(){
	'use strict';
	angular
		.module('com.module.users')
		.controller('LoginCtrl', function ($state, $scope) {
			$scope.account = '';
			$scope.password = '';
			$scope.errorMsg = '';

			$scope.login = function () {
				if ($scope.account == 'administrator' && $scope.password == 'testpass') {
					$state.go('app.home');
				} else {
					$scope.errorMsg = '账号或密码错误！';
				}
			}
		})
})();
