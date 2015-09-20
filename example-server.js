var server = require('./server')({})

server.listen(4444, function () {
  console.log('remote host on 4444')
})