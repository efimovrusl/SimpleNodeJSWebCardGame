module.exports = class User {
  socket
  level
  login
  password_hash
  is_playing

  constructor(socket) {
    this.socket = socket
    this.login = null
    this.password_hash = null
    this.level = null
    this.is_playing = false
  }

  log_in(login, password_hash) {
    this.login = login
    this.password_hash = password_hash
  }

  logout() {
    this.login = null
    this.password_hash = null
    this.level = null
    this.is_playing = false
  }

  serialize() {
    return `User:\tIP: ${this.socket.handshake.address.split('f:')[1]}\tLogin: ${this.login}\tPassword: ${this.password_hash}`
  }
}