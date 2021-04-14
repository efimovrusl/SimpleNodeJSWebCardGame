module.exports = class User {
  socket
  level
  login

  constructor(socket, login = null) {
    this.socket = socket
    
  }
}