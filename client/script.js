let socket = io('http://10.11.9.4:7070');

socket.on('connection', () => {
  console.log('--> Connected to server.')
})



socket.on('error', () => {
  console.log('--> Connection failed.')
})

function shit() {
  socket.emit('try_login', {login: 'pidor', password_hash: 'password'})
  socket.on('login_result', (data) => {
    console.log(data)
  })
}

