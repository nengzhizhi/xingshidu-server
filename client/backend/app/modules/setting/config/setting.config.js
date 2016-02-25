(function () {
  'use strict';
  angular
    .module('com.module.setting')
    .run(function ($rootScope) {
      $rootScope.addMenu('配置管理', '#', 'fa-setting', [
        { name: '配置列表', sref: 'app.setting.list' }
      ])
    })
})();