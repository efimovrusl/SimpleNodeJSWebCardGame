const server_ip = '10.11.11.4'

exports.host = server_ip
const port = 7070

const http = require('http').createServer()
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});
io.setMaxListeners(0)


const DbConnection = require('./DbConnection.js')
const User = require('./User.js')
const Battle = require('./Battle.js')


const db_connection = new DbConnection()
let users = new Map()
let battle = new Battle(users)

io.on('connection', (socket) => {
  console.log(`User (${socket.handshake.address.split('f:')[1]}) connected.`)
  users.set(socket.handshake.address, new User(socket))

  socket.on('message', text => {
    console.log(text)
  })
  socket.on('try_login', (data) => {
    console.log(data)

    db_connection.tryLogin(data.login, data.password_hash, result => {
      if (result == true) {
        db_connection.requestUser(data.login, (user_data) => {
          if (user_data) {
            let user = users.get(socket.handshake.address)
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
    users.get(socket.handshake.address).logout()
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
  

  /* GAME LOGIC */
  socket.on('ready', () => {
    users.get(socket.handshake.address).is_ready = true
  })
  socket.on('unready', () => {
    users.get(socket.handshake.address).is_ready = false
  })
  /* SENDING GAME CURRENT STATE */
  
  let send_info_interval 
  socket.on('disconnect', () => {
    clearInterval(send_info_interval)
  })
  send_info_interval = setInterval(() => {
    // if () {
    //   clearInterval(send_info_interval)
    //   stop = true
    // }
    // if (stop) return
    let online_users = []
    users.forEach(user => { if (user.socket.handshake.address != socket.handshake.address) online_users.push(user.login) })
    socket.emit('game_state', {
      im_loginned: !!users.get(socket.handshake.address).login, // boolean
      im_ready: users.get(socket.handshake.address).is_ready, // boolean
      im_playing: users.get(socket.handshake.address).is_playing, // boolean
      other_players: online_users, // array of logins <string>
      game_is_going_on: !!battle.state, // 0 is waiting for players
      game_state: battle.state, // stateEnum
      game_timer: battle.timer, // seconds
      enemy: battle.getEnemyLogin(socket),
      my_cards: battle.getMyCards(socket),
      round: battle.round,
      my_move: battle.myMove(socket),
      enemy_move: battle.enemyMove(socket),
    })

  }, 50)




  socket.on('disconnect', () => {
    console.log("CLEARED INTERVAL")
    clearInterval(send_info_interval)

    battle.end()
    console.log(`User (${socket.handshake.address.split('f:')[1]}) disconnected.`)
    users.delete(socket.handshake.address)
  })
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

setInterval(() => {
  let today = new Date();
  console.log(`/******************* [${users.size}] players online: [${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}] ********************/`)
  users.forEach((user) => {
    console.log(user.serialize())
  })
  // console.log(battle)
}, 1000)
