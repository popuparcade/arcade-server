var request = require('xhr')
var socketIO = require('socket.io-client')

module.exports = function controls (options) {
  options = options || {}
  var host = options.host || 'http://localhost:4444'
  var socket = socketIO(host)

  socket.on('connect', function () {})
  socket.on('disconnect', function () {})

  socket.sendGif = function sendGif (method, path, params, cb) {
    var url = host + '/gif'
    var body = new FormData()

    params.files.forEach(function (file, index) {
      body.append(index.toString, file)
    })

    request({
      method: method || 'POST',
      url: url,
      body: body
    }, function (err, response, body) {
      if (response.statusCode >= 400) return cb({ error: { status: response.statusCode } })
      return cb(null, response, JSON.parse(body))
    })
  }

  return socket
}
