(function(){
	'use strict';
	angular
		.module('com.module.shops')
		.service('ShopService', function (CoreService, Shop, Interaction) {
			this.getShops = function () {
				return Shop.find().$promise;
			}

			this.getShop = function (id) {
				return Shop.findById({ id: id }).$promise;
			}

			this.updateShop = function (shop, successCb, cancelCb) {
				return Shop.upsert(shop).$promise.then(function () {
					CoreService.alertSuccess('保存成功！', '', successCb);
				}, function (err) {
					CoreService.alertError('保存失败！', err && err.statusText, cancelCb);
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

			//FIXME
			//当findOne查询不到数据时，angular会认为这是一个错误
			this.getInteraction = function (id) {
				return Interaction.findById({id: id}).$promise;
			}

			this.interactionSockets = function () {
				return Interaction.sockets().$promise;
			}

			// this.interactionParticipants = function (id) {
			// 	return Interaction.serviceUsers({id: id}).$promise;
			// }

			this.startManually = function (id, successCb, cancelCb) {
				Shop.findById({id, id}).$promise.then(function (shop) {
					Shop.start({
						id: id,
						token: shop.token
					}).$promise.then(function(){
						CoreService.alertSuccess('手动开启成功！', '', successCb);
					})
				}).then(function (err) {
					CoreService.alertError('手动开启失败！', '', cancelCb);
				})
			}

			this.close = function (id, successCb, cancelCb) {
				Shop.findById({id, id}).$promise.then(function (shop) {
					return Shop.close({
						id: id, 
						token: shop.token
					}).$promise.then(function(){
						CoreService.alertSuccess('停止成功！', '', successCb);
					})
				}).then(function (err) {
					CoreService.alertError('停止失败！', err.statusText, cancelCb);
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
