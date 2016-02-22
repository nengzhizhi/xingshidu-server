(function(){
	'use strict';
	angular
		.module('com.module.shop')
		.service('ShopService', function (CoreService, Shop) {
			this.getShop = function (id) {
				return Shop.findById({ id: id }).$promise;
			}

			this.upsertShop = function (shop, successCb, cancelCb) {
				return Shop.upsert(shop).$promise.then(function () {
					CoreService.alertSuccess('保存成功！', '', successCb);
				}, function (err) {
					CoreService.alertError('删除失败！', err, cancelCb);
				})
			}

			this.deleteShop = function (id, successCb, cancelCb) {
				CoreService.confirm('确定删除？', '删除后无法恢复', function () {
					Shop.deleteById(id).$promise.then(function () {
						CoreService.alertSuccess('删除成功！', '', successCb);
					}, function (err) {
						CoreService.alertError('删除失败！', err, cancelCb);
					});
				})
			}

			this.getFormFields = function () {
				return [
					{
						key: 'name',
						type: 'input',
						templateOptions: {
							label: '店铺名称',
							required: true
						}
					},
					{
						key: 'rtmp_url',
						type: 'input',
						templateOptions: {
							label: 'RTMP地址',
							required: true
						}
					},
					{
						key: 'hls_url',
						type: 'input',
						templateOptions: {
							label: 'HLS地址',
							required: true
						}
					},
					{
						key: 'flv_url',
						type: 'input',
						templateOptions: {
							label: 'FLV地址',
							required: true
						}
					}
				];
			}
		})
})();
