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
						this.deleteShop = function(id){
							ShopService.deleteShop(id, function(){
								$state.go($state.current, {}, {reload: true});
							})
						}
					},
					resolve: {
						shops: function (ShopService) {
							return ShopService.getShops();
						}
					}
				})
				.state('app.shops.add', {
					url: '/add',
					templateUrl: 'modules/shops/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, ShopService, shop) {
						this.shop = shop;
						this.formFields = ShopService.getFormFields();
						this.formOptions = {};

						this.submit = function () {
							ShopService.updateShop(this.shop).then(function (shop) {
								$state.go('app.shops.edit');
							})
						}												
					},
					resolve: {
						shop: function () {

						}
					}
				})
				.state('app.shops.edit', {
					url: '/edit/:id',
					templateUrl: 'modules/shops/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, shop, ShopService) {
						this.shop = shop;
						this.formFields = ShopService.getFormFields();
						this.formOptions = {};
						this.submit = function () {
							ShopService.updateShop(this.shop).then(function () {
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
				.state('app.shops.detail', {
					url: '/detail/:id',
					templateUrl: 'modules/shops/views/detail.html',
					controllerAs: 'ctrl',
					controller: function ($stateParams, interaction, ShopService) {
						console.log(interaction);
						//console.log(interaction[0]);
						// this.interaction = interaction && interaction[0];
						// this.living = interaction && interaction.length > 0;

						this.close = function(){

						}
						// this.close = function (id) {
						// 	ShopService.closeInteraction(id, function () {
						// 		$state.go($state.current, {}, {reload: true});
						// 	});
						// }
					},
					resolve: {
						interaction: function ($stateParams, ShopService) {
							return ShopService.getShopInteraction($stateParams.id);

						}
					}
				})
		})
})();