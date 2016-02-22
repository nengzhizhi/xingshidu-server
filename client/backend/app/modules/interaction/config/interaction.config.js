(function () {
  'use strict';
  angular
    .module('com.module.interaction')
    .run(function ($rootScope) {
      $rootScope.addMenu('直播管理', '#', 'fa-users', [
        { name: '直播列表', sref: 'app.interaction.list' }
      ])
    })
})();
