(function(){
	'use strict';
	angular
		.module('com.module.core')
		.run(function (formlyConfig, $rootScope) {
    	formlyConfig.setWrapper([
				{
					name: 'label',
					templateUrl: 'modules/core/views/formly/label.html'
				}
    	])

    	formlyConfig.setType({
				name: 'input',
				template: '<input type="text" class="frm_input frm_msg_content" ng-model="model[options.key]">',
				wrapper: ['label']
			})

			$rootScope.domainUrl = "http://xsd.vookan.com/";
			$rootScope.socketUrl = "http://114.55.53.181:4003/";
		})
})();