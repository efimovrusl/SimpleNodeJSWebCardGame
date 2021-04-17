// const { isObject } = require("node:util");

let spiderman = new Card("Spider Man", 2, 4, 4, "assets/img/spiderman.jpg");
let captanamerica = new Card("Captan America", 3, 5, 1, "assets/img/captanamerica.jpg");


let mycards = []
var am_i_ready = false

socket.on('game_state', data => {
  console.log(data.my_cards)
  am_i_ready = data.im_ready
  mycards = []
  if (data.my_cards)
  data.my_cards.forEach((card) => { mycards.push(new Card(card.name, card.str, card.hp, card.cost, card.url)) })
  if (data.im_loginned) {
    if (data.im_playing) open_fight()
    else open_waiting()
  }
  

  mycards.forEach(card => {
    card.delete()
  })
  mycards.forEach(card => {
    card.render('yourCardsInHand')
  });


// [].forEach.call(document.querySelectorAll('.cardsInHand .card'), function(el) {
//     el.remove();
// });
  

})

// setInterval(() => {
//   document.getElementById('yourCardsInHand').innerHTML = ''


// }, 500)

function imready() {
  if (!am_i_ready) socket.emit('ready')
  // else socket.emit('unready')
}

spiderman.render('enemyCard');
captanamerica.render('yourCard');
// captanamerica.render('yourCardsInHand');
// spiderman.render('yourCardsInHand');

// ---- Resizing ----

function calcScale(averageWidth, clas) {
    let path = document.getElementsByClassName(clas);
    let width = document.body.clientWidth;
    let x = width * 1/ averageWidth;
    for (el of path) {
        el.style.transform = `scale(${x})`
    }
}

setInterval(function() {
    calcScale(1280, "hud");
}, 100);
setInterval(function() {
    calcScale(1280, "cardOnField");
}, 100);
setInterval(function() {
    calcScale(1090, "cardsInHand");
}, 100);

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

let cards = document.querySelectorAll('.cardsInHand .card');
    
[].forEach.call(cards, function(el) {
    el.onclick = function(e) {
    console.log(el);

        el.classList.add("active");
        setTimeout(function(){el.classList.add("transparent")}, 300);
        setTimeout(function(){el.remove()}, 600);
    }
});