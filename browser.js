var socketIO = require('socket.io-client')

module.exports = function controls (options) {
  options = options || {}
  var host = options.host || 'http://192.168.43.13:4444'
  var socket = socketIO(host)

  socket.on('disconnect', function () {})

  return socket
}
