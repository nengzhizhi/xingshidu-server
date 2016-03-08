(function(){
	'use strict';
	angular
		.module('com.module.setting')
		.service('SettingService', function (CoreService, Setting) {
			this.getSetting = function (id) {
				return Setting.findById({ id: id }).$promise;
			}

			this.getSettings = function () {
				return Setting.find().$promise;
			}

			this.deleteSetting = function (id, successCb, cancelCb) {
				CoreService.confirm('确定删除？', '删除后无法恢复', function () {
					Setting.deleteById(id).$promise.then(function () {
						CoreService.alertSuccess('删除成功！', '', successCb);
					}, function (err) {
						CoreService.alertError('删除失败！', err, cancelCb);
					});
				})
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
						type: 'input',
						templateOptions: {
							label: '值',
							required: true
						}
					}
				];
			}
		})
})();
