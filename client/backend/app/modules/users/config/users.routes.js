(function(){
	'use strict';
	angular
		.module('com.module.users')
		.config(function ($stateProvider) {
			$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: 'modules/users/views/login.html',
					controller: 'LoginCtrl',
					controllerAs: 'ctrl'
				})
				.state('logout', {
					url: '/logout',
					controllerAs: 'ctrl',
					controller: function (User, LoopBackAuth, $state) {
						User.logout({"access_token": LoopBackAuth.accessTokenId}, function () {
							$state.go('login');
						})
					}
				})
				.state('app.users', {
					abstract: true,
					url: '/user',
					templateUrl: 'modules/users/views/main.html'
				})
				.state('app.users.list', {
					url: '/list',
					templateUrl: 'modules/users/views/list.html',
					controllerAs: 'ctrl',
					controller: function (users) {
						this.users = users;
					},
					resolve: {
						users: function (User) {
							return User.find().$promise;
						}
					}
				})
				.state('app.users.detail', {
					url: '/detail/:id',
					templateUrl: 'modules/users/views/detail.html',
					controllerAs: 'ctrl',
					controller: function (UserService, user) {
						this.user = user;
						this.showIdentities = !!this.user.identities;
					},
					resolve: {
						user: function ($stateParams, UserService) {
							return UserService.userDetail($stateParams.id);
						}
					}
				})
		})
})();
