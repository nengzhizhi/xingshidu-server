(function(){
	'use strict';
	angular
		.module('com.module.shop')
		.service('SettingService', function (CoreService, Setting) {
			this.getSettings = function () {
				return Setting.find().$promise;
			}

			this.upsertSetting = function (setting, successCb, cancelCb) {
				return Setting.upsert(setting).$promise.then(function () {
					CoreService.alertSuccess('添加成功！', '', successCb);
				}, function (err) {
					console.log(err);
					CoreService.alertError('添加失败！', err, cancelCb);
				})
			}

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
