var server = require('./browser')()

var i = 0
setInterval(function () {
  server.emit('move', server.id, i)
  server.on('move', function (player, position) {
    console.log(player, position)
  })
  i++
}, 500)
