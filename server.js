var fs = require('fs')
var path = require('path')
var Busboy = require('busboy')
var st = require('st')
var serveStaticFiles = st({ path: __dirname + '/static', url: '/static' })

var app = module.exports = require('http').createServer(function handler (req, res) {
  if (serveStaticFiles(req, res)) return
  if (req.method === 'POST' && req.url === '/gif') {
    console.log('weeeeeeeeeeeeeeeeeee')
    receiveGif(req, res)
  } else {
    res.writeHead(200)
    res.end('hi')
  }
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

function receiveGif (req, res) {
  var busboy = new Busboy({ headers: req.headers })
  console.log(req.headers)

  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log(file, filename, encoding)
    var filepath = path.join(__dirname, 'static', filename)
    var stream = fs.createWriteStream(filepath, {
      flags: 'w'
    })

    file.on('data', function (data) {
      stream.write(data)
    })

    file.on('end', function () {
      stream.end()
    })
  })

  busboy.on('finish', function () {
    res.writeHead('200')
    res.end()
  })

  req.pipe(busboy)
}
