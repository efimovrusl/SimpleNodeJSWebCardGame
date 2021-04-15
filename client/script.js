let socket = io('http://10.11.11.4:7070');

socket.on('connection', () => {
  console.log('--> Connected to server.')
})

socket.on('error', () => {
  console.log('--> Connection failed.')
})

let LoginPage = document.getElementsByClassName("login")[0];
let registrationPage = document.getElementsByClassName("reg")[0];
let waitingPage = document.getElementsByClassName("waiting-room")[0];
let fightPage = document.getElementsByClassName("fight")[0];
function changePage(option) {
    switch(option){
        case 'login': 
            open_login()
            break;
        case 'reg': 
            open_reg()
            break;
        case 'waiting-room': 
            open_waiting()
            break;
        case 'fight': 
            open_fight()
            break;
    }
}

function open_login() {
  registrationPage.style.display = "none";
  waitingPage.style.display = "none";
  fightPage.style.display = "none";
  LoginPage.style.display = "block";
}
function open_reg() {
  LoginPage.style.display = "none";
  waitingPage.style.display = "none";
  fightPage.style.display = "none";
  registrationPage.style.display = "block";
}
function open_waiting() {
  LoginPage.style.display = "none";
  registrationPage.style.display = "none";
  fightPage.style.display = "none";
  waitingPage.style.display = "block";
}
function open_fight() {
  LoginPage.style.display = "none";
  registrationPage.style.display = "none";
  waitingPage.style.display = "none";
  fightPage.style.display = "block";
}

let loginReg = document.getElementById("login");
let passReg = document.getElementById("password");
let passConf = document.getElementById("confirm");
function regUser() {
  console.log(loginReg.value);
  console.log(passReg.value);
  console.log(passConf.value);
  if(passReg.value !== passConf.value){
    alert("Passwords does not match");
    
  }
  else {
    socket.emit('check_login', {login: loginUser.value})
    socket.on('check_login_result', (data) => {
      console.log(data)
    })
    socket.emit('try_register', {login: loginReg.value, password_hash: passReg.value});
    socket.on('register_result', (data) => {
      console.log(data)
      if(data == true){
        loginUser.value = loginReg.value;
        passUser.value = passReg.value;
        changePage('login');
      }
    })
    
  }
  
}

let loginUser = document.getElementById("login2");
let passUser = document.getElementById("password2");
function checkUser(){
  console.log(loginUser.value);
  console.log(passUser.value);
  socket.emit('check_login', {login: loginUser.value})
  socket.on('check_login_result', (data) => {
    console.log(data)
    if(data == true){
      socket.emit('try_login', {login: loginUser.value, password_hash: passUser.value});
      socket.on('login_result', (data) => { 
        console.log(data)
        if(data == true){
          loginUser.value = "";
          passUser.value = "";
          changePage('waiting-room');
        }
      })
    }
  })
}

function logoutUser(){
  socket.emit('logout');
  changePage('login');
}