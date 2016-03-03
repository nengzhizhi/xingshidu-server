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
		})
})();