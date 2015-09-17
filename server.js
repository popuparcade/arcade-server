var app = module.exports = require('http').createServer(function handler (req, res) {
  res.writeHead(200)
  res.end('hi')
}, { serveClient: false })

if (require.main === module) {
  app.listen(4444, function () {
    console.log('running on 4444')
  })
}

var io = require('socket.io')(app)

io.on('connection', function (socket) {
  socket.on('move', function (player, position) {
    console.log(player, position)
    socket.broadcast.emit('move', player, position)
  })
})
