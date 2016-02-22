var socketIO = require('socket.io');
var _ = require('lodash');
var config = require('../config.json');

module.exports = function (app) {
  app.io = new socketIO();

  // TODO　此处添加一个输入过滤中间件
  // app.io.use(function () {
  //
  // })

  var self = this;
  self.users = [];

  self.getSomeUsers = function (users, number) {
    return users;
  }

  app.io.on('connection', function (socket) {
    socket.emit('connected', {});

    socket.on('join room', function (data) {
      if (!self.users[data.roomId]) {
        self.users[data.roomId] = {};
      }

      socket.join(data.roomId, function (err) {
        socket.roomId = data.roomId;
        self.users[data.roomId][socket.id] = {
          nickname: data.nickname,
          avatar: data.avatar
        };

        if (!err)
          app.io.to(socket.roomId).emit('joined', {
            userNumber: _.size(self.users[data.roomId]),
            //someUsers: getSomeUsers(self.users, 10)
            someUsers: self.users[socket.roomId]
          })
      });
    })

    socket.on('send message', function (data) {
      socket.to(data.roomId).send('new message', {
        message: data.message
      });
    })

    socket.on('disconnect', function(data) {
      delete self.users[socket.roomId][socket.id];
    })
  })

  app.io.listen(config.servicePort);
}
// FIXME
// function filterMessage (rawMessage) {
//   return rawMessage;
// }
