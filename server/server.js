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


// let sockets = [];
io.on('connection', (socket) => {
  // sockets.push(socket);
  socket.on('message', text => {
    console.log(text)
  })
  socket.on('try_login', (data) => {
    console.log(data)
    db_connection.tryLogin(data.login, data.password_hash, (result) => {
      socket.emit('login_result', result)
    })

  })
  console.log(`a user connected. IP: ${socket.handshake.address.split('f:')[1]}`);
  socket.on('disconnect', () => {
    console.log(`${socket.handshake.address.split('f:')[1]} disconnected.`)     
  })
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
