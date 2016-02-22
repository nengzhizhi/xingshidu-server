(function(){
  'use strict';
  angular
    .module('com.module.users')
    .service('UserService', function ($state) {
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

      this.getFormFields = function (formType) {
        var form = [
          {
            key: 'username',
            type: 'input',
            templateOptions: {
              label: "用户名",
              required: true
            }
          }, {
            key: 'password',
            type: 'input',
            templateOptions: {
              label: '密码',
              required: true
            }
          }, {
            key: 'role',
            type: 'select',
            templateOptions: {
              label: '角色',
              options: [
                {
                  name: '管理员',
                  value: 'administrator'
                }
              ]
            }
          }
        ];
        return form;
      }
    })
})();
