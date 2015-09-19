var socketIO = require('socket.io-client')

module.exports = function controls (options) {
  options = options || {}
  var host = options.host || 'http://localhost:4444'
  var socket = socketIO(host)

  socket.on('connect', function () {})
  socket.on('disconnect', function () {})

  return socket
}
