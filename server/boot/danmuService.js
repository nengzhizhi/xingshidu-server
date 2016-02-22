var socketIO = require('socket.io');
var PORT = 3003;

module.exports = function(app){
  var io = new socketIO();
  io.on('connection', function (socket) {
    socket.on('join', function (data) {
      console.log('join');
    })

    socket.on('danmu', function (data) {
      console.log('raw message: ', data.message);
      var cleanMessage = filterMessage(data.message);

      io.emit('danmu', { message: cleanMessage });
    })
  })
  io.listen(PORT);
}

function filterMessage (rawMessage) {
  return rawMessage;
}
