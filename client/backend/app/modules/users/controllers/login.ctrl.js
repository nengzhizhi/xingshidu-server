(function(){
	'use strict';
	angular
		.module('com.module.users')
		.controller('LoginCtrl', function ($state, $scope, User, UserService, CoreService, LoopBackAuth) {
			$scope.user = {};
			$scope.formFields = UserService.getLoginFormFields();
			$scope.formOptions = {};
			$scope.login = function () {
				User.login($scope.user, function (user) {
					$state.go('app.home');
				}, function (res) {
					CoreService.alertError('用户名或密码错误！');
					//console.log(res.data.error);
				})
			}
		})
})();
