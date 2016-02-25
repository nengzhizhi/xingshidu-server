var socketIO = require('socket.io');
var _ = require('lodash');
var config = require('../config.json');

//instance
module.exports = function (app) {
	this.interactions = [];
	this.io = new socketIO();

	this.getRevealedUsers = function (users, number) {
		return _.takeRight( _.toArray(users), number);
	}

	this.closeInteraction = function (id) {
		var self = this;
		if (!!self.interactions[id]) {
			self.io.to(id).emit('close interaction');
			delete self.interactions[id];
		}
	}

	this.getUsers = function (id) {
		var self = this;
		return self.interactions[id] || [];
	}

	var self = this;
	this.io.on('connection', function (socket) {
		socket.on('join interaction', function (data) {
			if (!self.interactions[data.interactionId]) {
				self.interactions[data.interactionId] = {};
			}

			socket.join(data.interactionId, function (err) {
				socket.interactionId = data.interactionId;

				self.interactions[data.interactionId][socket.id] = {
					nickname: data.nickname,
					avatar: data.avatar,
					userId: data.userId
				}

				if (!err) {
					self.io.to(data.interactionId).emit('joined', {
						userNumber: _.size(self.interactions[data.interactionId]),
						revealedUsers: self.getRevealedUsers(self.interactions[data.interactionId], 10)
					})
				}
			})
		})

		socket.on('send message', function (data) {
      self.io.to(socket.interactionId).emit('new message', {
        nickname: data.nickname,
        avatar: data.avatar,
        message: data.message
      });			
		})

    socket.on('disconnect', function(data) {
      if (!!self.interactions[socket.interactionId] && !!self.interactions[socket.interactionId][socket.id])
        delete self.interactions[socket.interactionId][socket.id];
    })		
	})

	this.io.listen(config.interactionServicePort);
	console.log('start interaction service on: ', config.interactionServicePort);
	app.instanceService = this;
}