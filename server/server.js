const port = 7070
const host = '10.11.9.4'
exports.host = host

const http = require('http').createServer()
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

const DbConnection = require('./DbConnection.js')

const db_connection = new DbConnection()
// db_connection.getUsers()

let Users = new Map()
io.on('connection', (socket) => {
  // sockets.push(socket);
  socket.on('message', text => {
    console.log(text)
  })
  socket.on('try_login', (data) => {
    console.log(data)

    db_connection.tryLogin(data.login, data.password_hash, result => {
      if (result == true) {
        Users.set(socket.handshake.address, new User({
          socket: socket,
          login: data.login,
        }))
      }
      socket.emit('login_result', result)
    })
  })
  socket.on('check_login', (data) => {
    db_connection.checkLogin(data.login, result => {
      socket.emit('check_login_result', result)
    })
  })
  socket.on('try_register', (data) => {
    db_connection.tryRegister(data.login, data.password_hash, result => {
      socket.emit('register_result', result)
    })
  })
  console.log(`User (${socket.handshake.address.split('f:')[1]}) connected.`);
  socket.on('disconnect', () => {
    console.log(`User (${socket.handshake.address.split('f:')[1]}) disconnected.`)
    Users.delete(socket.handshake.address)
  })
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
