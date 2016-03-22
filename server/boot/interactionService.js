var socketIO = require('socket.io');
var _ = require('lodash');
var config = require('../config.json');

//instance
module.exports = function (app) {
//-----------------------------------------------------------
	var InteractionService = function (cfg) {
		this.init = function () {
			var self = this;

			self.io = new socketIO();
			self.interactions = {};

			self.io.on('connection', function (socket) {
				socket.on('join interaction', function (data) {
					self.joinInteraction(data.interactionId, socket, data, function (err) {
						if (!err) {
							self.notifyInteraction(data.interactionId, 'joined', {
								userNumber: _.size(self._getUsers(data.interactionId)),
								revealedUsers: self._getRevealedUsers(data.interactionId, 10)
							});
						}
					})
				})

				socket.on('send message', function (data) {
					self.notifyInteraction(data.interactionId, 'new message', data);
				})

				socket.on('disconnect', function (data) {
					var interaction = self.interactions && self.interactions[socket.interactionId];

					self.leftInteraction(socket.interactionId, socket);
					self.notifyInteraction(socket.interactionId, 'left', {
						userNumber: _.size(self._getUsers(socket.interactionId)),
						revealedUsers: self._getRevealedUsers(socket.interactionId, 10)
					})
				})
			})

			self.io.listen(config.interactionServicePort);
			console.log('start interaction service on: ', config.interactionServicePort);
		}

		this.notifyInteraction = function(interactionId, eventName, eventData){
			var self = this;
			var interaction = self.interactions && self.interactions[interactionId];
			if (!!interaction) {
				self.io.to(interactionId).emit(eventName, eventData);
			}	
		}

		this.startInteraction = function(interactionId){
			var self = this;
			self.closeInteraction(interactionId);

			self.interactions[interactionId] = {};
		}

		this.joinInteraction = function(interactionId, socket, userInfo, cb){
			var self = this;

			if (!self.interactions || !self.interactions[interactionId])
				return cb(new Error('互动不存在'));

			socket.join && socket.join(interactionId, function (err) {
				socket.interactionId = interactionId;
				
				self.interactions[interactionId][socket.id] = {
					nickname: userInfo.nickname,
					avatar: userInfo.avatar,
					userId: userInfo.userId
				}
				cb(err);
			});
		}

		this.closeInteraction = function(interactionId){
			var self = this;
			delete self.interactions[interactionId];
		}

		this.leftInteraction = function(interactionId, socket){
			var self = this;

			var interaction = self.interactions && self.interactions[interactionId];
			if (!!interaction)
				delete interaction[socket.id];
		}

		this.listInteractions = function () {
			var self = this;
			return self.interactions;
		}

		this._getRevealedUsers = function (interactionId, number) {
			var self = this;
			return _.takeRight( _.toArray(self._getUsers(interactionId)), number);
		}

		this._getUsers = function(interactionId){
			var self = this;
			return self.interactions && self.interactions[interactionId];
		}
	}

//-----------------------------------------------------------
	var interactionModel = app.models.Interaction;
	var interactionService = new InteractionService();
	interactionService.init();
	app.interactionService = interactionService;
//-----------------------------------------------------------
}