const stateEnum = {
  "waiting":   0,
  "countdown": 1,
  "move":      2,
  "showdown":  3,
  "results":   4,
}
const secret_card = { name: 'secret_card', str: '?', hp: '?', cost: '?', url: 'assets/img/cards/secret_card.jpg' }
const cards = [
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
class Card {
  
  constructor(round = 'default', curr_cards_unfiltered = null) {
    if (round == 'default') return
    let curr_cards = curr_cards_unfiltered.filter(card => card.name != 'secret_card')
    console.log("YOU HAVE " + curr_cards.length + " CARDS")
    let chosenID
    let hasEnoughMana = false
    do {
      chosenID = randomInt(0, 22)
      hasEnoughMana = false
      curr_cards.forEach((card) => { if (card.cost <= round) hasEnoughMana = true })
      if (cards[chosenID].cost <= round) hasEnoughMana = true
    } while (curr_cards.includes(cards[chosenID]) || !hasEnoughMana)
    this.name = cards[chosenID].name
    this.str = cards[chosenID].str
    this.hp = cards[chosenID].hp
    this.cost = cards[chosenID].cost
    this.url = cards[chosenID].url
  }
  set(new_card) {
    this.name = new_card.name
    this.str = new_card.str
    this.hp = new_card.hp
    this.cost = new_card.cost
    this.url = new_card.url
  }
  set_secret() {
    this.set(secret_card)
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
  cards = [[],[]] // need to be nullified with this.nullifyCards()
  mana = [ 1, 1 ]
  made_move = [ false, false ] // did player[id] make a move
  used_card = [ null, null ] // array of two chosen cards
  hp = [ 5, 5 ]
  winner = null
  logins = []
  onBattleEnd = function() {}

  /** @param {Map} Users */
  constructor(Users, onBattleEnd) {
    this.nullifyCards()
    this.onBattleEnd = onBattleEnd
    


    this.update_interval = setInterval(() => {
      // console.log(this.state)
      this.users = []
      Users.forEach(user => this.users.push(user))
      if (this.users.length < 2) this.end()
      switch(this.state) {
        case stateEnum.waiting:
          let ready_users = this.users.filter(user => user.is_ready)
          if (ready_users.length >= 2) {
            this.logins[0] = ready_users[0].login
            this.logins[1] = ready_users[1].login
            this.players.push(ready_users[0])
            this.players.push(ready_users[1])
            this.users.forEach(user => user.is_ready = false)
            this.players[0].is_playing = true
            this.players[1].is_playing = true
            this.state = stateEnum.countdown
            this.listenForCardUses()
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

              if (this.timer <= 0 || this.playersMadeTheirMoves()) {
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
            }, 1000)
          }
          break;
        case stateEnum.showdown:
          if (!this.toggled_interval) {
            this.timer = 3
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
            if (this.used_card[0] != null && this.used_card[1] == null) this.hp[1]--
            else if (this.used_card[1] != null && this.used_card[0] == null) this.hp[0]--
            else if (this.used_card[0] == null && this.used_card[1] == null) { this.hp[0]--; this.hp[1]-- }
            else if (this.used_card[0].str * this.used_card[0].hp == this.used_card[1].str * this.used_card[1].hp) {
              this.hp[0]--
              this.hp[1]--
            } else {
              this.winner = (this.used_card[0].str * this.used_card[0].hp > this.used_card[1].str * this.used_card[1].hp
                || this.used_card[0].str > this.used_card[1].str || this.used_card[0].hp > this.used_card[1].hp) ? 0 : 1
              this.hp[this.winner ? 0 : 1]--
            }

          }
          break;
        case stateEnum.results:
          if (!this.toggled_interval) {
            this.timer = 5
            this.toggled_interval = setInterval(() => {
              this.timer--
              // nullifying all values to initial Battle state
              if (this.timer <= 0) {
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
        if (this.cards[i][j].name == 'secret_card')
          this.cards[i][j] = new Card(this.round, this.cards[i])
  }

  update() {
    
  }

  end() {
    this.onBattleEnd(this.logins, this.hp)

    clearInterval(this.toggled_interval)
    clearTimeout(this.toggled_timeout)
    this.toggled_interval = null
    this.state = stateEnum.waiting
    this.players.forEach(user => user.is_playing = false)
    this.players = []
    this.timer = 3
    this.round = 1
    this.nullifyCards()
    this.mana = [ 1, 1 ]
    this.made_move = [ false, false ]
    this.used_card = [ null, null ]
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

  
  playersMadeTheirMoves() {
    return this.used_card[0] && this.used_card[1]
        && this.used_card[0].name != 'secret_card'
        && this.used_card[1].name != 'secret_card'
  }
  my_id(socket) {
    return socket.handshake.address == this.users[0].socket.handshake.address ? 0 : 1
  }
  myMove(socket) {
    let id = this.my_id(socket)
    if (this.used_card[id]) return this.used_card[id]
    else return secret_card
  }
  enemyMove(socket) {
    let id = this.my_id(socket)
    if (this.used_card[(id + 1) % 2] && this.made_move[id]) return this.used_card[(id + 1) % 2]
    else return secret_card
  }
  myHp(socket) {
    let id = this.my_id(socket)
    if (this.hp[id]) return this.hp[id]
    else return 1
  }
  enemyHp(socket) {
    let id = this.my_id(socket)
    if (this.hp[(id + 1) % 2]) return this.hp[(id + 1) % 2]
    else return 1
  }
  myLevel(socket) {
    let id = this.my_id(socket)
    if (this.players[id]) return this.players[0].level
    else return null
  }
  enemyLevel(socket) {
    let id = this.my_id(socket)
    if (this.players[(id + 1) % 2]) return this.players[(id + 1) % 2].level
    else return null
  }
  myLogin(socket) {
    let id = this.my_id(socket)
    if (this.players[id]) return this.players[id].login
    else return null
  }
  enemyLogin(socket) {
    let id = this.my_id(socket)
    if (this.players[(id + 1) % 2]) return this.players[(id + 1) % 2].login
    else return null
  }

  nullifyCards() {
    this.cards = [[new Card(),new Card(),new Card()],
                  [new Card(),new Card(),new Card()]]
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 3; j++)
        this.cards[i][j].set_secret()
  }

  listenForCardUses() {
    for (let i = 0; i < 2; i++) {
      this.players[i].socket.on('use_card', card_id => {
        console.log(`USE CARD: ${card_id}`)
        if (this.cards[i][card_id].name != 'secret_card'
          && this.cards[i][card_id].cost <= this.round 
          && !this.made_move[i]) {
          console.log(`CARD #${card_id} USED`)

          this.made_move[i] = true
          this.used_card[i] = new Card()
          this.used_card[i].set(this.cards[i][card_id])

          console.log(`USED CARD: ${this.used_card[i].url}`)


          setTimeout(() => { this.cards[i][card_id].set_secret() }, 800)
          this.players[i].socket.emit('use_result', { result: true, id: card_id })
        } else {
          this.players[i].socket.emit('use_result', { result: false, id: card_id })
        }
      })
    }
  }

}

function randomInt(min, max) {
  if (max < min) {
    let temp = min
    min = max
    max = temp
  }
  min -= 0.49999
  max += 0.49999
  return Math.round((Math.random() * (max - min) + min))
}