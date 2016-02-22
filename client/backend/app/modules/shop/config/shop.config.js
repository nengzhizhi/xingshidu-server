(function(){
	'use strict';
	angular
		.module('com.module.shop')
		.run(function ($rootScope) {
			$rootScope.addMenu('店铺管理', '#', 'fa-file', [
				{ name: '店铺列表', sref: 'app.shop.list' }
			]);
		})
})();
