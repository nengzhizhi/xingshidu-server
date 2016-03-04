(function(){
	'use strict';
	angular
		.module('com.module.shops')
		.config(function ($stateProvider) {
			$stateProvider
				.state('app.shops', {
					abstract: true,
					url: '/shops',
					templateUrl: 'modules/shops/views/main.html'
				})
				.state('app.shops.list', {
					url: '/list',
					templateUrl: 'modules/shops/views/list.html',
					controllerAs: 'ctrl',
					controller: function ($state, shops, ShopService) {
						this.shops = shops;
					},
					resolve: {
						shops: function (ShopService) {
							return ShopService.getShops();
						}
					}
				})
				.state('app.shops.edit', {
					url: '/edit/:id',
					templateUrl: 'modules/shops/views/form.html',
					controllerAs: 'ctrl',
					controller: function (shop, ShopService) {
						this.shop = shop;
						this.formFields = ShopService.getFormFields();
						this.formOptions = {};
						this.submit = function () {
							ShopService.update(this.shop).then(function () {
								$state.go($state.current, {}, { reload: true });
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