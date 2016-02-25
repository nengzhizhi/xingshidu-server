(function(){
	'use strict';
	angular
		.module('backendApp', [
			'ngCookies',
			'lbServices',
			'formly',
			'formlyBootstrap',
			'oitozero.ngSweetAlert',
			'ui.router',
			'com.module.core',
			'com.module.users',
			'com.module.shop',
			'com.module.interaction',
			'com.module.setting'
		]);
})();
