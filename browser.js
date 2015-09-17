var socketIO = require('socket.io-client')

module.exports = function controls (options) {
  options = options || {}
  var socket = socketIO(options.host || 'http://localhost:4444')

  socket.on('connect', function () {
    console.log(socket.id)
  })

  socket.on('disconnect', function () {})

  return socket
}
