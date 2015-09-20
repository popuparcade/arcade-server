var fs = require('fs')
var path = require('path')
var Busboy = require('busboy')
var st = require('st')
var serveStaticFiles = st({ path: __dirname + '/static', url: '/static' })

module.exports = function (options) {
  var port = options.port || 4444
  var host = options.host || 'http://localhost:4444'
  var app = require('http').createServer(function handler (req, res) {
    if (serveStaticFiles(req, res)) return
    if (req.method === 'POST' && req.url === '/gif') {
      receiveGif(req, res)
    } else {
      res.writeHead(200)
      res.end('hi')
    }
  }, { serveClient: false })

  var io = require('socket.io')(app)

  var machines = {}
  io.on('connection', function (socket) {
    socket.on('hello', function (id) {
      machines[id] = socket.id
      console.log('connected:', machines[id])
    })

    socket.on('move', function (player, position) {
      socket.broadcast.emit('move', player, position)
    })
  })

  function receiveGif (req, res) {
    var busboy = new Busboy({ headers: req.headers })

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      var filepath = path.join(__dirname, 'static', filename)
      var stream = fs.createWriteStream(filepath, { flags: 'w' })

      file.on('data', function (data) {
        stream.write(data)
      })

      file.on('error', function (err) {
        console.log(err)
      })

      file.on('end', function () {
        stream.end()
        var name = filename.split('-')[0]
        console.log('machines object:', machines)
        for (var id in machines) {
          if (id !== name) {
            var url = host + '/static/' + filename + '?rand=' + Math.random()
            console.log('sending gif to:', machines[id])
            io.to(machines[id]).emit('new-gif', url)
          }
        }
      })
    })

    busboy.on('error', function (err) {
      console.log(err)
    })

    busboy.on('finish', function () {
      res.writeHead('200')
      res.end()
    })

    req.pipe(busboy)
  }

  return app
}

