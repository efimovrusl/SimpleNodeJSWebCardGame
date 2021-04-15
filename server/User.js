module.exports = class User {
  socket
  id
  login
  password_hash
  level
  is_ready
  is_playing

  constructor(socket) {
    this.socket = socket
    this.id = null
    this.login = null
    this.password_hash = null
    this.level = null
    this.is_ready = false
    this.is_playing = false
  }

  log_in(id, login, password_hash) {
    this.id = id
    this.login = login
    this.password_hash = password_hash
  }

  logout() {
    this.id = null
    this.login = null
    this.password_hash = null
    this.level = null
    this.is_playing = false
  }

  serialize() {
    return `User: #${this.id}\tIP: ${this.socket.handshake.address.split('f:')[1]}\tLogin: ${this.login}\tPassword: ${this.password_hash}`
  }
}