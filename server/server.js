const port = 7070
const host = '10.11.9.4'
exports.host = host

const http = require('http').createServer()
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

const DbConnection = require('./DbConnection.js')
const User = require('./User.js')

const db_connection = new DbConnection()
// db_connection.getUsers()

let Users = new Map()
io.on('connection', (socket) => {
  console.log(`User (${socket.handshake.address.split('f:')[1]}) connected.`)
  Users.set(socket.handshake.address, new User(socket))

  socket.on('message', text => {
    console.log(text)
  })
  socket.on('try_login', (data) => {
    console.log(data)

    db_connection.tryLogin(data.login, data.password_hash, result => {
      if (result == true) {
        db_connection.requestUser(data.login, (user_data) => {
          if (user_data) {
            let user = Users.get(socket.handshake.address)
            user.log_in(
              user_data.id,
              user_data.login, 
              user_data.password_hash
            )
          } else {
            console.log("User request failed!")
          }
        })
        
        
      }
      socket.emit('login_result', result)
    })
  })
  socket.on('logout', () => {
    Users.get(socket.handshake.address).logout()
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
  socket.on('disconnect', () => {
    console.log(`User (${socket.handshake.address.split('f:')[1]}) disconnected.`)
    Users.delete(socket.handshake.address)
  })
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

setInterval(() => {
  console.log("/*******************************************************************/")
  Users.forEach((user) => {
    console.log(user.serialize())
  })
}, 2000)
