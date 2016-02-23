var socketIO = require('socket.io');
var _ = require('lodash');
var config = require('../config.json');

module.exports = function (app) {
  app.io = new socketIO();
  this.getSomeUsers = function (users, number) {
    return _.takeRight( _.toArray(users), number);
  }
  this.users = [];

  //FIXME 插入中间件过滤输入

  var self = this;
  app.io.on('connection', function (socket) {
    socket.on('join interaction', function (data) {
      if (!self.users[data.interactionId]) {
        self.users[data.interactionId] = {};
      }

      socket.join(data.interactionId, function (err) {
        socket.interactionId = data.interactionId;

        self.users[data.interactionId][socket.id] = {
          nickname: data.nickname,
          avatar: data.avatar,
          userId: data.userId
        };

        if (!err)
          app.io.to(socket.interactionId).emit('joined', {
            userNumber: _.size(self.users[data.interactionId]),
            someUsers: self.getSomeUsers(self.users[data.interactionId], 10)
          })
      });
    })

    socket.on('send message', function (data) {
      socket.to(data.interactionId).send('new message', {
        nickname: data.nickname,
        avatar: data.avatar,
        message: data.message
      });
    })

    socket.on('disconnect', function(data) {
      if (!!self.users[socket.interactionId] && !!self.users[socket.interactionId][socket.id])
        delete self.users[socket.interactionId][socket.id];
    })
  })

  app.io.listen(config.servicePort);
}
