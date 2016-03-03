var socketIO = require('socket.io');
var _ = require('lodash');
var config = require('../config.json');

//instance
module.exports = function (app) {
	this.interactions = [];
	this.creaters = [];
	this.io = new socketIO();
	var interactionModel = app.models.Interaction;

	this.getRevealedUsers = function (users, number) {
		return _.takeRight( _.toArray(users), number);
	}

	this.closeInteraction = function (id) {
		var self = this;
		if (!!self.interactions[id]) {
			self.io.to(id).emit('close interaction', { id: id });
			delete self.interactions[id];
			delete self.creaters[id];
		}
	}

	this.setInteractionCreater = function (id, userId) {
		var self = this;
		if (!self.interactions[id]) {
			self.interactions[id] = {};
		}
		self.creaters[id] = userId;
	}

	this.getUsers = function (id) {
		var self = this;
		return _.values(self.interactions[id]) || [];
	}

	var self = this;
	this.io.on('connection', function (socket) {
		socket.on('join interaction', function (data) {
			console.log('join interaction:', data);
			
			//FIXME 检查输入参数
			if (!data.interactionId)
				return;

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
    	var interaction = self.interactions && self.interactions[socket.interactionId];
    	if (!interaction)
    		return;

    	//console.log(socket.interactionId, interaction);
    	//console.log(interaction[socket.id].userId, self.creaters[socket.interactionId]);
      
      if (!!interaction && !!interaction[socket.id]) {
				if (interaction[socket.id].userId == self.creaters[socket.interactionId]) {
					interactionModel.close(socket.interactionId, function (err, result) {});
					return;
				}

				delete self.interactions[socket.interactionId][socket.id];

				self.io.to(data.interactionId).emit('left', {
					userNumber: _.size(interaction),
					revealedUsers: self.getRevealedUsers(interaction, 10)
				})
      }
    })		
	})

	this.io.listen(config.interactionServicePort);
	console.log('start interaction service on: ', config.interactionServicePort);
	app.interactionService = this;
}