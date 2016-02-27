(function(){
	'use strict';
	angular
		.module('com.module.shop')
		.config(function ($stateProvider) {
			$stateProvider
				.state('app.setting', {
					abstract: true,
					url: '/setting',
					templateUrl: 'modules/setting/views/main.html'
				})
				.state('app.setting.add', {
					url: '/add',
					templateUrl: 'modules/setting/views/form.html',
					controllerAs: 'ctrl',
					controller: function (SettingService, setting, $state) {
						this.setting = setting;
						this.formFields = SettingService.getFormFields();
						this.formOptions = {};

						this.submit = function() {
							SettingService.upsertSetting(this.setting).then(function (setting) {
								$state.go('app.setting.list');
							})
						}
					},
					resolve: {
						setting: function(){}
					}
				})				
				.state('app.setting.list', {
					url: '/list',
					templateUrl: 'modules/setting/views/list.html',
					controllerAs: 'ctrl',
					controller: function ($state, SettingService, settings) {
						this.settings = settings;
					},
					resolve: {
						settings: function(SettingService){
							return SettingService.getSettings();
						}
					}
				})
		});
})();