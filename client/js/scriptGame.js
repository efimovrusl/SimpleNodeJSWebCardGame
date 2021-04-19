let enemyUsedCard = new Card(document.querySelector("#enemyChosenCard"), 'enemyUsedCard')
let myUsedCard = new Card(document.querySelector("#myChosenCard"), 'myUsedCard')
let timer = 0
let round = 0

let mycards = []
let am_i_ready = false
let am_i_playing = false


function startNewGame() {

  timer = 3
  round = 0
  mycards = [
    new Card(document.querySelector("#card1"), 0),
    new Card(document.querySelector("#card2"), 1),
    new Card(document.querySelector("#card3"), 2),
  ]

}


let game_state_update = socket.on('game_state', data => {

  am_i_ready = data.im_ready
  if (!am_i_playing && data.im_playing)
    startNewGame()
  am_i_playing = data.im_playing
  if (round != data.round) {
    round = data.round
    if (round == 1) {
      setTimeout(() => {
        fadeIn("readyAlert")
      }, 500)
      setTimeout(() => {
        fadeOut("readyAlert")
      }, 2000)
    }
    document.querySelector('#nextRound').querySelector('.alertSpan').innerText = `Round ${round}`
    setTimeout(() => {
      fadeIn("nextRound")
    }, 3000)
    setTimeout(() => {
      fadeOut("nextRound")
    }, 4000)
    if (data.game_state == "results") {
      if (data.my_hp > data.enemy_hp) {
        setTimeout(() => {
          fadeIn("winAlert")
        }, 3000)
        setTimeout(() => {
          fadeOut("winAlert")
        }, 4000)
      } else if (data.my_hp < data.enemy_hp) {
        setTimeout(() => {
          fadeIn("defeatAlert")
        }, 3000)
        setTimeout(() => {
          fadeOut("defeatAlert")
        }, 4000)
      } else {
        setTimeout(() => {
          fadeIn("drawAlert")
        }, 3000)
        setTimeout(() => {
          fadeOut("drawAlert")
        }, 4000)
      }
    }
  }
  myUsedCard.set(data.my_move)
  enemyUsedCard.set(data.enemy_move)

  // updating cards // if card's changed, it shows if was hidden before
  for (let i = 0; i < data.my_cards.length; i++) mycards[i].set(data.my_cards[i])
  // mycards.forEach(card => card.update()) // set() already updates card

  if (data.im_loginned) {
    if (data.im_playing) {
      open_fight()
    } else {
      open_waiting()
      am_i_playing = false
    }
  }

  //------ UI ------//
  timer = data.game_timer
  document.querySelector('#timer_countdown').innerText = timer

  resizeHp(Number(data.my_hp), "yourHealth");
  resizeHp(Number(data.enemy_hp), "enemysHealth");

  document.querySelector('#my_coins').innerText = `Coins: ${data.round}`
  document.querySelector('#enemy_coins').innerText = `Coins: ${data.round}`
  document.querySelector('#my_level').innerText = `Level: ${data.my_level}`
  document.querySelector('#enemy_level').innerText = `Level: ${data.enemy_level}`

  document.querySelector('#my_login').innerText = `${data.my_login}`
  document.querySelector('#enemy_login').innerText = `${data.enemy_login}`


})

/*  im_loginned: !!users.get(socket.handshake.address).login, // boolean
    im_ready: users.get(socket.handshake.address).is_ready, // boolean
    im_playing: users.get(socket.handshake.address).is_playing, // boolean
    other_players: online_users, // array of logins <string>
    game_is_going_on: !!battle.state, // 0 is waiting for players
    game_state: battle.state, // stateEnum
    game_timer: battle.timer, // seconds
    enemy: battle.getEnemyLogin(socket),
    my_cards: battle.getMyCards(socket),
    round: battle.round                                                 */

function imready() {
  if (!am_i_ready) socket.emit('ready')
  // else socket.emit('unready')
}

// ---- Resizing ----

function calcScale(averageWidth, clas, skew) {
  let path = document.getElementsByClassName(clas);
  let width = document.body.clientWidth;
  let x = width * 1/ averageWidth;
  for (el of path) el.style.transform = `scale(${x}) skew(${skew}deg)`
}

setInterval(function() { calcScale(1280, "hud", 0); }, 100);
setInterval(function() { calcScale(1480, "cardOnField", 0); }, 100);
setInterval(function() { calcScale(1090, "cardsInHand", 0); }, 100);
setInterval(function() { calcScale(1050, "timer", -17); }, 100);
setInterval(function() { calcScale(1090, "alertSpan", -17); }, 100);

// resizing hp

function resizeHp(index, id) {
  let maxHp = 5;
  let el = document.getElementById(id).getElementsByTagName('span')[0];
  let i = maxHp - (index);
  switch(index) {
    case 0:
      el.style.transform  = `scaleX(calc(1 - ${(1 / maxHp) * i}))`;
      el.style.backgroundColor = "rgb(102, 189, 80)";
      break;
    case 1:  
      el.style.transform  = `scaleX(calc(1 - ${(1 / maxHp) * i}))`;
      el.style.backgroundColor = "rgb(224, 80, 44)";
      break;
    case 2:  
      el.style.transform  = `scaleX(calc(1 - ${(1 / maxHp) * i}))`;
      el.style.backgroundColor = "rgb(224, 146, 44)";
      break;
    case 3:  
      el.style.transform  = `scaleX(calc(1 - ${(1 / maxHp) * i}))`;
      el.style.backgroundColor = "rgb(221, 211, 67)";
      break;
    case 4:  
      el.style.transform  = `scaleX(calc(1 - ${(1 / maxHp) * i}))`;
      el.style.backgroundColor = "rgb(163, 206, 65)";
      break;
    case 5:  
      el.style.transform  = `scaleX(calc(1 - ${(1 / maxHp) * i}))`;
      el.style.backgroundColor = "rgb(102, 189, 80)";
      break;
    
  }
}

resizeHp(3, "yourHealth");
resizeHp(2, "enemysHealth");



function fuck(message) {
  if (__local_shit)
    clearInterval(__local_shit)
  __local_shit = setTimeout(() => {
    console.log(">>>> " + message + " <<<<")
  },1)
}

let __local_shit = null



// fade alerts

function fadeIn(id) {
  let el = document.getElementById(id);
  el.style.display = "flex";
  setTimeout(() => {el.style.opacity = 1;}, 10)
}
  
function fadeOut(id) {
  let el = document.getElementById(id);
  el.style.opacity = 0;
  setTimeout(() => {el.style.display = "none";}, 300)
}
