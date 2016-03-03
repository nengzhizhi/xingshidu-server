(function(){
	'use strict';
	angular
		.module('com.module.example')
		.config(function ($stateProvider) {
			$stateProvider
				.state('app.example', {
					abstract: true,
					url: '/example',
					templateUrl: 'modules/example/views/main.html'
				})
				.state('app.example.form', {
					url: '/form',
					templateUrl: 'modules/example/views/form.html',
					controller: 'FormCtrl',
					controllerAs: 'ctrl'
				})
		})
})();