(function () {
  'use strict';
  angular
    .module('com.module.users')
    .factory('LoopbackPassport', function ($cookies, $http) {
      // var self = {
      //   login: function (data, cb) {
      //     LoopbackAuth.currentUserId = LoopbackAuth.accessTokenId = null;
      //     $http.post('/auth/local/login', {
      //       username: data.username,
      //       password: data.password
      //     }).then(function (response) {
      //       if (response.data) {
      //         LoopbackAuth.currentUserId = 'xxx';
      //         LoopbackAuth.accessTokenId = 'xxx';
      //       }
      //
      //       LoopbackAuth.save();
      //       cb(null, self.currentUser);
      //     }, function () {
      //       LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId = null;
      //       LoopBackAuth.save();
      //       cb({});
      //     })
      //   },
      //   logout: function (cb) {
      //     $http.post('/auth/local/logout');
      //     delete $cookies["access_token"];
      //     delete $cookies["accessToken"];
      //     self.currentUser = null;
      //     cb();
      //   },
      //   ensureCurrentUser: function (cb) {
      //   }
      // }
      //
      // return self;

      var self = {
        login: function (data, cb) {
          cb();
        },
        logout: function (cb) {
          cb();
        },
        ensureCurrentUser: function (cb) {
          self.currentUser = {
            username: 'xxxx'
          }

          cb(null, self.currentUser);
        }
      }

      return self;
    })
})();
