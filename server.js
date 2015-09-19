var fs = require('fs')
var path = require('path')
var Busboy = require('busboy')
var st = require('st')
var serveStaticFiles = st({ path: __dirname + '/static', url: '/static' })

var app = module.exports = require('http').createServer(function handler (req, res) {
  if (serveStaticFiles(req, res)) return
  if (req.method === 'POST' && req.url === '/gif') {
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

var machines = {}
io.on('connection', function (socket) {
  socket.on('hello', function (id) {
    machines[id] = socket.id
    console.log(machines)
  })

  socket.on('move', function (player, position) {
    socket.broadcast.emit('move', player, position)
  })
})

function receiveGif (req, res) {
  var busboy = new Busboy({ headers: req.headers })

  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    var filepath = path.join(__dirname, 'static', filename)
    var stream = fs.createWriteStream(filepath, {
      flags: 'w'
    })

    file.on('data', function (data) {
      stream.write(data)
    })

    file.on('end', function () {
      stream.end()
      var name = filename.split('-')[0]
      console.log('wat', machines)
      for (var id in machines) {
        console.log(machines)
        if (id !== name) {
          var url = 'http://172.20.10.2:4444/static/' + filename + '?rand=' + Math.random()
          console.log(io.to)
          console.log(machines[id])
          io.to(machines[id]).emit('new-gif', url)
        }
      }
    })
  })

  busboy.on('finish', function () {
    res.writeHead('200')
    res.end()
  })

  req.pipe(busboy)
}
