module.exports = class Battle {
  
  stateEnum = {
    "waiting": 0,
    "countdown": 1,
    "move": 2,
    "showdown": 3,
    "results": 4
  }
  states = stateEnum.waiting
  players = null
  users = null
  timer = 3
  toggledInterval = null

  /** @param {Map} Users */
  constructor(Users) {
    this.users = Users
    setInterval(this.update, 10)
  }

  update() {
    if (state == stateEnum.waiting) {
      let count = 0
      this.users.forEach(user => { if (user.is_ready) count++ })
      
    }
  }

}