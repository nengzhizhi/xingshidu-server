var async = require('async');

module.exports = function (app) {
  var loopback = require('loopback');

  var User = app.models.User;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  var users = {
    "administrator": [
      { email: 'nengzhizhi@126.com', username: 'administrator' , password: 'testpass' }
    ]
  }

  for (var key in users) {
    Role.findOrCreate({ name: key }, function (err, role) {
      async.each(users[key], function (user, callback) {
        User.findOrCreate(user, function(err, user) {
          if (!!err) {
            return callback(err);
          }

          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: user.id
          }, callback);
        });
      }, function (err) {
        if (!!err) {
          console.log(err);
        }
      })
    })
  }
}
