(function(){
	'use strict';
	angular
		.module('com.module.setting')
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

						this.delete = function (id) {
							SettingService.deleteSetting(id, function(){
								$state.go($state.current, {}, {reload: true});
							})
						}
					},
					resolve: {
						settings: function(SettingService){
							return SettingService.getSettings();
						}
					}
				})
				.state('app.setting.edit', {
					url: '/edit/:id',
					templateUrl: 'modules/setting/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, setting, SettingService) {
						this.setting = setting;
						this.formFields = SettingService.getFormFields();
						this.formOptions = {};
						this.submit = function () {
							SettingService.updateShop(this.setting).then(function () {
								$state.go($state.current, {}, { reload: true });
							})
						}
					},
					resolve: {
						setting: function ($stateParams, SettingService) {
							return SettingService.getSetting($stateParams.id);
						}
					}
				})

		});
})();