const stateEnum = {
  "waiting": 0,
  "countdown": 1,
  "move": 2,
  "showdown": 3,
  "results": 4
}

class Card {
  cards = [
    { name: 'card', str: 2, hp: 2, cost: 1, url: 'https://drive.google.com/file/d/1J7o_-lpHYT0esxbKbO3aVGhldSztd0PH/view?usp=sharing' },
    { name: 'card', str: 3, hp: 1, cost: 1, url: 'https://drive.google.com/file/d/1EWKXC8A19skWsDeLxfFiZgBwPZny1CSD/view?usp=sharing' },
    { name: 'card', str: 2, hp: 2, cost: 1, url: 'https://drive.google.com/file/d/1FzJSXMX3sjXM1q8mOE_GUGvwKF2GYhMH/view?usp=sharing' },
    { name: 'card', str: 1, hp: 2, cost: 1, url: 'https://drive.google.com/file/d/19xNDqE9G3eBMaBCfSxNVN6UCjuLfg1EL/view?usp=sharing' },
    { name: 'card', str: 1, hp: 4, cost: 1, url: 'https://drive.google.com/file/d/1P_tzeclAw96GfcqLBREkzOEH5utvAhbA/view?usp=sharing' },
    { name: 'card', str: 2, hp: 2, cost: 1, url: 'https://drive.google.com/file/d/199yfWNjXpS3TTYS3dKx9VqBvYizYjWy4/view?usp=sharing' },
    { name: 'card', str: 3, hp: 2, cost: 1, url: 'https://drive.google.com/file/d/1qLucUpSK-4Tvvtw4FkPmpjTCVhfYQcKS/view?usp=sharing' },
    { name: 'card', str: 2, hp: 2, cost: 1, url: 'https://drive.google.com/file/d/1QhHvUb8wtbsgvWG49vW0ymsL9c9wZRXc/view?usp=sharing' },
    { name: 'card', str: 3, hp: 2, cost: 2, url: 'https://drive.google.com/file/d/1rD0jPGyAw6aNruSxIXyvuKyNC44weywj/view?usp=sharing' },
    { name: 'card', str: 4, hp: 2, cost: 2, url: 'https://drive.google.com/file/d/1MO01WfPAyAZUlvpTV5iOGv-UGeEAhHkX/view?usp=sharing' },
    { name: 'card', str: 2, hp: 4, cost: 2, url: 'https://drive.google.com/file/d/1RHdxWcZ9zhQuLoAISUvfsO_9bwXv-UIG/view?usp=sharing' },
    { name: 'card', str: 3, hp: 2, cost: 2, url: 'https://drive.google.com/file/d/13q2gsHvYwOVz1zJmp0QCpaqj5dt3_6ux/view?usp=sharing' },
    { name: 'card', str: 2, hp: 3, cost: 2, url: 'https://drive.google.com/file/d/1QksautMDNwB3dpzl-r1eiU7Mewijtc5Q/view?usp=sharing' },
    { name: 'card', str: 2, hp: 5, cost: 3, url: 'https://drive.google.com/file/d/1sHUaevUAiTbRi2ifkz8DcGd6V3fLe0Ao/view?usp=sharing' },
    { name: 'card', str: 2, hp: 3, cost: 3, url: 'https://drive.google.com/file/d/1LElyREx6QOkCp228PYUQO9JuCG296WD_/view?usp=sharing' },
    { name: 'card', str: 4, hp: 2, cost: 3, url: 'https://drive.google.com/file/d/1ehH82V4oT4LmbbwGFxouQ0bq5bkB9oNP/view?usp=sharing' },
    { name: 'card', str: 5, hp: 3, cost: 4, url: 'https://drive.google.com/file/d/1oj3iedyXMnzQEyl_IKZzhJVJgG3BPecb/view?usp=sharing' },
    { name: 'card', str: 4, hp: 4, cost: 4, url: 'https://drive.google.com/file/d/1-MgSj6mbbhO57Mjq3kx3UE5RJJfdbRlb/view?usp=sharing' },
    { name: 'card', str: 4, hp: 5, cost: 5, url: 'https://drive.google.com/file/d/1IJeDom88fX0Kx5GT5D_Vs7TzRxkKb_Wq/view?usp=sharing' },
    { name: 'card', str: 2, hp: 6, cost: 5, url: 'https://drive.google.com/file/d/1RlmYZrt9zE6pcSYxmIUnFuRtf6ggYzSO/view?usp=sharing' },
    { name: 'card', str: 6, hp: 5, cost: 6, url: 'https://drive.google.com/file/d/11dmNC2THwKjUt76RlMVPzdnW83NdIaVZ/view?usp=sharing' },
    { name: 'card', str: 5, hp: 6, cost: 6, url: 'https://drive.google.com/file/d/1a-R53-56c5UbIWtZPuc8qeDgH8Yg6v4o/view?usp=sharing' },
    { name: 'card', str: 7, hp: 7, cost: 7, url: 'https://drive.google.com/file/d/1Z2y6LLiooXbCPIcE2iYcjUNjYFTcQ0iy/view?usp=sharing' },
  ]
  str
  hp
  cost
  url
  constructor(round, curr_cards) {
    let chosenID
    do {
      chosenID = randomInt(0, 22)
      let hasEnoughMana = false
      curr_cards.forEach((card) => { if (card.cost <= round) hasEnoughMana = true })
      if (this.cards[chosenID].cost <= round) hasEnoughMana = true
    } while (curr_cards.includes(this.cards[chosenID]) || !hasEnoughMana)
    str = this.cards[chosenID].str
    hp = this.cards[chosenID].hp
    cost = this.cards[chosenID].cost
    url = this.cards[chosenID].url
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
  made_move = [ false, false ] // did player[id] make a mode
  used_card = [ false, false ] // array of two chosen cards
  hp = [ 5, 5 ]
  winner = null

  /** @param {Map} Users */
  constructor(Users) {
    this.users = Users
    this.update_interval = setInterval(this.update, 10)
  }

  deal_cards() {
    for (let i = 0; i < 2; i++)
      while (cards[i].length < 3)
        cards[i].push(new Card(this.round, cards[i]))
  }

  update() {
    switch(this.state) {
      case stateEnum.waiting:
        let ready_users = []
        this.users.forEach(user => { if (user.is_ready && user.login) ready_users.push(user) })
        if (ready_users.length >= 2) {
          this.players.push(ready_users[0])
          this.players.push(ready_users[1])
          this.users.forEach(user => { user.is_ready = false })
          this.players[0].is_playing = true
          this.players[1].is_playing = true
          this.state = this.stateEnum.countdown
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
          }, 1000)
          for (let i = 0; i < 2; i++) {
            this.players[i].socket.on('use_card', (card_id) => {
              if (this.cards[i,card_id].cost <= this.round && !this.made_move[i])
                this.made_move[i] = true
                this.used_card[i] = card_id
                this.cards[i,card_id] = null
                this.cards[i] = this.cards[i].filter(card => card != null)
                this.players[i].socket.off('use_card')
            })
          }
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
                if (round <= 6) {
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
  }

  end() {
    if (this.toggled_interval != null && this.toggled_interval != '1sectimer') {
      clearInterval(this.toggled_interval)
    }
    if (this.toggled_interval == '1sectimer' && this.toggled_timeout != null) {
      this.toggled_interval = null
      clearTimeout(this.toggled_timeout)
    }
    this.toggled_interval = null
    this.state = stateEnum.waiting
    this.players = null
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
    if (this.state == stateEnum.waiting) return null
    if (this.users[0].socket.handshake.address == socket.handshake.address) return cards[0]
    else if (this.users[1].socket.handshake.address == socket.handshake.address) return cards[1]
    else return null
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