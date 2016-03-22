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
					controller: function ($rootScope, $state, $stateParams, ShopService, shop) {
						var self = this;
						self.startUrl = $rootScope.domainUrl + 'api/shops/start?id=' + shop.id + '&token=' + shop.token;
						self.shop = shop;

						if (shop.status == 'present' && shop.interactionId) {
							ShopService.getInteraction(shop.interactionId)
								.then(function (interaction) {
									self.interaction = interaction;
									self.living = 'living';
								})
						} else {
							self.living = '';
							self.interaction = {};
						}

						this.close = function (id) {
							ShopService.close(id, function(){
								$state.go($state.current, {}, {reload: true});
							})
						}

						this.startManually = function (id) {
							ShopService.startManually(id, function(){
								$state.go($state.current, {}, {reload: true});
							})
						}
					},
					resolve: {
						shop: function(ShopService, $stateParams){
							return ShopService.getShop($stateParams.id);
						}
					}
				})
				.state('app.shops.interactions', {
					url: '/interactions',
					templateUrl: 'modules/shops/views/interactions.html',
					controllerAs: 'ctrl',
					controller: function(sockets){
						console.log(sockets);
						this.sockets = sockets;
					},
					resolve: {
						sockets: function(ShopService){
							return ShopService.interactionSockets();
						}
					}
				})
				.state('app.shops.socket', {
					url: '/socket/:id',
					templateUrl: 'modules/shops/views/socket.html',
					controllerAs: 'ctrl',
					controller: function($rootScope, $scope, $state, interaction) {
						var self = this;

						self.socket = io($rootScope.socketUrl);
						self.socket.on('joined', function (data) {
							self.join_result = "加入成功！互动人数：" + data.userNumber + "\n";
							$scope.$apply(self.join_result);
						})
						self.socket.on('left', function (data) {
							self.join_result = "有人离开！互动人数：" + data.userNumber + "\n";
							$scope.$apply(self.join_result);
						})						
						self.socket.on('new message', function (data) {
							self.message_result = "收到[\'" + data.nickname + '\']的消息[\'' + data.message + '\']';
							$scope.$apply(self.message_result);
						})
						self.nickname = '测试者' + parseInt(Math.random() * 100 + 1);

						this.connect = function(){
							self.connect_result = "连接成功！";
						}
						this.join = function(){
							self.socket.emit('join interaction', {
								interactionId: interaction.id,
								nickname: self.nickname,
								avatar: 'xxx.png',
								userId: 'xxx'
							});
						}

						this.send = function(){
							self.socket.emit('send message', {
								interactionId: interaction.id,
								nickname: self.nickname,
								avatar: 'xxx.png',
								message: '测试消息' + parseInt(Math.random() * 100 + 1)
							})							
						}
					},
					resolve: {
						interaction: function (ShopService, $stateParams) {
							return ShopService.getInteraction($stateParams.id);
						}
					}
				})
		})
})();