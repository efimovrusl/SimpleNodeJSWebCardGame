let enemyUsedCard = null
let myUsedCard = null
let timer = 0
let round = 0

let mycards = []
let am_i_ready = false
let am_i_playing = false


function startNewGame() {
  
  // fuck("ASDASDAS" + document.getElementById('enemyChosenCard'))
  // enemyUsedCard = new Card({ name: "Enemy card", dom_element: document.querySelector("#enemyChosenCard") })
  // myUsedCard = new Card({ name: "Your card", dom_element: document.querySelector("#myChosenCard") });

  enemyUsedCard = new Card(document.querySelector("#enemyChosenCard"));
  
  myUsedCard = new Card(document.querySelector("#myChosenCard"));

  timer = 3
  round = 0
  mycards = [
    new Card(document.querySelector("#card1"), 0),
    new Card(document.querySelector("#card2"), 1),
    new Card(document.querySelector("#card3"), 2),
  ]

}


let game_state_update = socket.on('game_state', data => {
  // fuck("I'm playing: " + am_i_playing)
  console.log(data.my_cards)
  am_i_ready = data.im_ready
  if (!am_i_playing && data.im_playing)
    startNewGame()
  am_i_playing = data.im_playing
  timer = data.game_timer

  // updating cards // if card's changed, it shows if was hidden before
  for (let i = 0; i < data.my_cards.length; i++) mycards[i].set(data.my_cards[i])

  if (data.im_loginned) {
    if (data.im_playing) {
      open_fight()
    } else {
      open_waiting()
      am_i_playing = false
    }
  }

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

// enemyCard.render('enemyCard');
// myUsedCard.render('yourCard');

// ---- Resizing ----

function calcScale(averageWidth, clas) {
  let path = document.getElementsByClassName(clas);
  let width = document.body.clientWidth;
  let x = width * 1/ averageWidth;
  for (el of path) el.style.transform = `scale(${x})`
}

setInterval(function() { calcScale(1280, "hud"); }, 100);
setInterval(function() { calcScale(1280, "cardOnField"); }, 100);
setInterval(function() { calcScale(1090, "cardsInHand"); }, 100);

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

// ---------

// let cards = document.querySelectorAll('.cardsInHand .card');


    
// [].forEach.call(cards, function(el) {
//   el.onclick = function(e) {
//     console.log(el);
    
//     el.classList.add("active");
//     setTimeout(function(){el.classList.add("transparent")}, 300);
//     // setTimeout(function(){el.remove()}, 600);
//     setTimeout(function(){el.classList.remove("active")}, 600);
//   }
// });







function fuck(message) {
  if (__local_shit)
    clearInterval(__local_shit)
  __local_shit = setTimeout(() => {
    console.log(">>>> " + message + " <<<<")
  },1)
}

let __local_shit = null