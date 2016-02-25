(function(){
	'use strict';
	angular
		.module('com.module.shop')
		.service('SettingService', function (CoreService, Setting) {
			this.getFormFields = function () {
				return [
					{
						key: 'key',
						type: 'input',
						templateOptions: {
							label: '键',
							required: true
						}
					},
					{
						key: 'value',
						type: 'textarea',
						templateOptions: {
							label: '值',
							required: true
						}
					}
				];
			}
		})
})();
