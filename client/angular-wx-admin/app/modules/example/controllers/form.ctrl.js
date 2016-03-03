(function(){
	'use strict';
	angular
		.module('com.module.example')
		.controller('FormCtrl', function ($state, $scope, ExampleService) {
			$scope.data = {};
			$scope.formFields = ExampleService.getFormFields();
			$scope.formOptions = {};			
		})
})();
