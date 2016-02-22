(function(){
	'use strict';
	angular
		.module('com.module.shop')
		.config(function ($stateProvider) {
			$stateProvider
				.state('app.shop', {
					abstract: true,
					url: '/shop',
					templateUrl: 'modules/shop/views/main.html'
				})
				.state('app.shop.add', {
					url: '/add',
					templateUrl: 'modules/shop/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, ShopService, shop) {
						this.shop = shop;
						this.formFields = ShopService.getFormFields();
						this.formOptions = {};

						this.submit = function () {
							ShopService.upsertShop(this.shop).then(function (shop) {
								$state.go('app.shop.edit');
							})
						}
					},
					resolve: {
						shop: function(){}
					}
				})
				.state('app.shop.list', {
					url: '/list',
					templateUrl: 'modules/shop/views/list.html',
					controllerAs: 'ctrl',
					controller: function (ShopService, $state, shops) {
						this.shops = shops;
						this.deleteShop = function (shopId) {
							ShopService.deleteShop(shopId, function(){
								$state.go($state.current, {}, {reload: true});
							});
						}
					},
					resolve: {
						shops: function (Shop) {
							return Shop.find().$promise;
						}
					}
				})
				.state('app.shop.edit', {
					url: '/edit/:id',
					templateUrl: 'modules/shop/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, $stateParams, ShopService, shop) {
						this.shop = shop;

						this.formFields = ShopService.getFormFields();
						this.formOptions = {};
						this.submit = function () {
							ShopService.upsertShop(this.shop).then(function () {
								$state.go($state.current, {}, {reload: true});
							})
						}
					},
					resolve: {
						shop: function ($stateParams, ShopService) {
							return ShopService.getShop($stateParams.id);
						}
					}
				})
		})
})();
