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
				.state('app.setting.list', {
					url: '/list',
					templateUrl: 'modules/setting/views/list.html',
					controllerAs: 'ctrl',
					controller: function ($state, SettingService, setting) {
						this.setting = setting;
						this.formFields = SettingService.getFormFields();
						this.formOptions = {};

						this.submit = function () {
							SettingService.upsertSetting(this.setting).then(function (setting) {
								$state.go('app.setting.edit');
							})
						}
					},
					resolve: {
						setting: function(){}
					}
				})
		});
})();