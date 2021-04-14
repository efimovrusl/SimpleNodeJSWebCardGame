module.exports = class Battle {
  
  stateEnum = {
    "countdown": 0,
    "move": 1,
    "showdown": 2,
    "results": 3
  }
  state
  players
  
  /** @param {Map} Users */
  constructor(Users) {
    switch(Users.size()) {
      case 0:

        break;
      case 1:

        break;
      default:
        
        break;
    }
    Array.from(Users)
  }
}