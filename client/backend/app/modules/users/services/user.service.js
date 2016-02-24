(function(){
  'use strict';
  angular
    .module('com.module.users')
    .service('UserService', function ($state, User) {
      this.currentUser = function (successCb, errorCb) {
        return User.getCurrent(successCb, errorCb);
      }

      this.getLoginFormFields = function () {
        var loginForm = [
          {
  					key: 'username',
  					type: 'input',
  					templateOptions: {
  						placeholder: '账号',
  						require: true,
  						type: 'input'
  					}
  				},
  				{
  					key: 'password',
  					type: 'input',
  					templateOptions: {
  						placeholder: '密码',
  						require: true,
  						type: 'password'
  					}
  				}
        ]
        return loginForm;
      }
    })
})();
