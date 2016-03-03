(function(){
  'use strict';
  angular
    .module('com.module.example')
    .service('ExampleService', function ($state) {
    	this.getFormFields = function(){
    		var form = [
    			{
  					key: 'username',
  					type: 'input',
  					templateOptions: {
              label: '账号',
  						required: true,
  						type: 'input'
  					}   				
    			}
    		]

    		return form;
    	}
    })
})();    