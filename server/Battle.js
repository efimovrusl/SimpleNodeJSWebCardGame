const stateEnum = {
  "waiting": 0,
  "countdown": 1,
  "move": 2,
  "showdown": 3,
  "results": 4
}

class Card {
  cards = [
    { name: 'card', str: 2, hp: 2, cost: 1, url: 'assets/img/cards/1.jpeg' },
    { name: 'card', str: 3, hp: 1, cost: 1, url: 'assets/img/cards/2.jpeg' },
    { name: 'card', str: 2, hp: 2, cost: 1, url: 'assets/img/cards/3.jpeg' },
    { name: 'card', str: 1, hp: 2, cost: 1, url: 'assets/img/cards/4.jpeg' },
    { name: 'card', str: 1, hp: 4, cost: 1, url: 'assets/img/cards/5.jpeg' },
    { name: 'card', str: 2, hp: 2, cost: 1, url: 'assets/img/cards/6.jpeg' },
    { name: 'card', str: 3, hp: 2, cost: 1, url: 'assets/img/cards/7.jpeg' },
    { name: 'card', str: 2, hp: 2, cost: 1, url: 'assets/img/cards/8.jpeg' },
    { name: 'card', str: 3, hp: 2, cost: 2, url: 'assets/img/cards/9.jpeg' },
    { name: 'card', str: 4, hp: 2, cost: 2, url: 'assets/img/cards/10.jpeg' },
    { name: 'card', str: 2, hp: 4, cost: 2, url: 'assets/img/cards/11.jpeg' },
    { name: 'card', str: 3, hp: 2, cost: 2, url: 'assets/img/cards/12.jpeg' },
    { name: 'card', str: 2, hp: 3, cost: 2, url: 'assets/img/cards/13.jpeg' },
    { name: 'card', str: 2, hp: 5, cost: 3, url: 'assets/img/cards/14.jpeg' },
    { name: 'card', str: 2, hp: 3, cost: 3, url: 'assets/img/cards/15.jpeg' },
    { name: 'card', str: 4, hp: 2, cost: 3, url: 'assets/img/cards/16.jpeg' },
    { name: 'card', str: 5, hp: 3, cost: 4, url: 'assets/img/cards/17.jpeg' },
    { name: 'card', str: 4, hp: 4, cost: 4, url: 'assets/img/cards/18.jpeg' },
    { name: 'card', str: 4, hp: 5, cost: 5, url: 'assets/img/cards/19.jpeg' },
    { name: 'card', str: 2, hp: 6, cost: 5, url: 'assets/img/cards/20.jpeg' },
    { name: 'card', str: 6, hp: 5, cost: 6, url: 'assets/img/cards/21.jpeg' },
    { name: 'card', str: 5, hp: 6, cost: 6, url: 'assets/img/cards/22.jpeg' },
    { name: 'card', str: 7, hp: 7, cost: 7, url: 'assets/img/cards/23.jpeg' },
  ]
  str
  hp
  cost
  url
  constructor(round, curr_cards) {
    let chosenID
    let hasEnoughMana = false
    do {
      chosenID = randomInt(0, 22)
      hasEnoughMana = false
      curr_cards.forEach((card) => { if (card.cost <= round) hasEnoughMana = true })
      if (this.cards[chosenID].cost <= round) hasEnoughMana = true
    } while (curr_cards.includes(this.cards[chosenID]) || !hasEnoughMana)
    this.str = this.cards[chosenID].str
    this.hp = this.cards[chosenID].hp
    this.cost = this.cards[chosenID].cost
    this.url = this.cards[chosenID].url
  }
}

module.exports = class Battle {
  state = stateEnum.waiting
  players = []
  users = null
  timer = 3
  toggled_interval = null
  update_interval = null
  toggled_timeout = null
  round = 1
  cards = [[],[]] // array of arrays of users' cards
  mana = [1, 1]
  made_move = [ false, false ] // did player[id] make a move
  used_card = [ false, false ] // array of two chosen cards
  hp = [ 5, 5 ]
  winner = null

  /** @param {Map} Users */
  constructor(Users) {


    this.update_interval = setInterval(() => {
      // console.log(this.state)
      this.users = []
      Users.forEach(user => { this.users.push(user) })
      switch(this.state) {
        case stateEnum.waiting:
          let ready_users = this.users.filter(user => user.is_ready)
          if (ready_users.length >= 2) {
            this.players.push(ready_users[0])
            this.players.push(ready_users[1])
            this.users.forEach(user => { user.is_ready = false })
            this.players[0].is_playing = true
            this.players[1].is_playing = true
            this.state = stateEnum.countdown
          }

          break;
        case stateEnum.countdown:
          if (!this.toggled_interval) {
            this.timer = 3
            this.toggled_interval = setInterval(() => {
              this.timer--
              if (this.timer <= 0) {
                this.timer = 0
                clearInterval(this.toggled_interval)
                this.toggled_interval = '1sectimer'
                this.toggled_timeout = setTimeout(() => {
                  this.state = stateEnum.move
                  this.toggled_interval = null
                  this.toggled_timeout = null
                  this.deal_cards()

                }, 1000)
              }
            }, 1000)
          }
          break;
        case stateEnum.move:
          if (!this.toggled_interval) {
            this.timer = 30
            this.toggled_interval = setInterval(() => {
              this.timer--

              if (this.timer <= 0) {

                this.timer = 0
                clearInterval(this.toggled_interval)
                this.toggled_interval = '1sectimer'
                this.toggled_timeout = setTimeout(() => {
                  this.state = stateEnum.showdown
                  this.toggled_interval = null
                  this.toggled_timeout = null
                  this.round++
                  this.deal_cards()
                }, 1000)
              }
              for (let i = 0; i < 2; i++) {
                this.players[i].socket.on('use_card', (card_id) => {
                  if (this.cards[i,card_id].cost <= this.round && !this.made_move[i]) {
                    this.made_move[i] = true
                    this.used_card[i] = card_id

                    this.cards[i,card_id] = null
                    this.cards[i] = this.cards[i].filter(card => card != null)
                    this.players[i].socket.off('use_card')
                    this.players[i].socket.emit('use_result', { result: true, id: card_id })
                  } else {
                    this.players[i].socket.emit('use_result', { result: false, id: card_id })
                  }
                })
              }
            }, 1000)

            

          }
          break;
        case stateEnum.showdown:
          if (!this.toggled_interval) {
            this.timer = 5
            this.toggled_interval = setInterval(() => {
              this.timer--
              if (this.timer <= 0) {
                this.timer = 0
                clearInterval(this.toggled_interval)
                this.toggled_interval = '1sectimer'
                this.toggled_timeout = setTimeout(() => {
                  if (this.round <= 6) {
                    this.state = stateEnum.move
                    for (let i = 0; i < 2; i++) {
                      this.used_card[i] = null
                      this.made_move[i] = false
                      this.mana[i] = this.round
                    }
                    this.deal_cards()
                  } else {
                    this.state = stateEnum.results
                  }
                  this.toggled_interval = null
                  this.toggled_timeout = null
                }, 1000)
              }
            }, 1000)
            // CALCULATING WHO WON ROUND
            this.winner = (this.used_card[0].str * this.used_card[0].hp > this.used_card[1].str * this.used_card[1].hp
              || this.used_card[0].str > this.used_card[1].str || this.used_card[0].hp > this.used_card[1].hp) ? 0 : 1
            this.hp[this.winner]--
          }
          break;
        case stateEnum.results:
          if (!this.toggled_interval) {
            this.timer = 10
            this.toggled_interval = setInterval(() => {
              this.timer--
              if (this.timer <= 0) {
                // nullifying all values to initial Battle state
                this.end()
              }
            }, 1000)
  
          }
          break;
      }
    }), 10
  }

  deal_cards() {
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 3; j++)
        this.cards[i].push(new Card(this.round, this.cards[i]))
    
  }

  update() {
    
  }

  end() {
    // if (this.toggled_interval != null && this.toggled_interval != '1sectimer') {
      clearInterval(this.toggled_interval)
    // }
    // if (this.toggled_interval == '1sectimer' && this.toggled_timeout != null) {
    //   this.toggled_interval = null
      clearTimeout(this.toggled_timeout)
    // }
    this.toggled_interval = null
    this.state = stateEnum.waiting
    this.players = []
    this.timer = 3
    this.round = 1
    this.cards = [[],[]]
    this.mana = [1, 1]
    this.made_move = [ false, false ]
    this.used_card = [ false, false ]
    this.hp = [ 5, 5 ]
    this.winner = null
  }

  getMyCards(socket) {
    if (this.players && this.players.length == 2) {
      if (this.players[0].socket.handshake.address == socket.handshake.address) return this.cards[0]
      else if (this.players[1].socket.handshake.address == socket.handshake.address) return this.cards[1]
      else return []
    } else return []
  }

  getEnemyLogin(socket) {
    if (this.state == stateEnum.waiting) return null
    if (this.users[0].socket.handshake.address == socket.handshake.address) return this.users[1].login
    else return this.users[0].login
  }

}

function randomInt(min, max) {
  if (max < min) {
    let temp = min
    min = max
    max = temp
  }
  min -= 0.49
  max += 0.49
  return Math.round((Math.random() * (max - min) + min))
}