(function(){
	'use strict';
	angular
		.module('com.module.shops')
		.service('ShopService', function (Shop) {
			this.getShops = function () {
				return Shop.find().$promise;
			}
		})
})();		
