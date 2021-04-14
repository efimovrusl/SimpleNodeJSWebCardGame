module.exports = class DbConnection {
  #connection;
  mysql;
  constructor() {
    this.mysql = require('mysql2')

    this.connectToDatabase()
    this.#connection.connect((err) => {
      /* on error */
      if (err) console.error(`Connection to MySQL failed: ${err.message}`)
      else console.log(`Connected to MySQL`)
    })

    this.#connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
        login VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_link VARCHAR(255) DEFAULT 'https://ibb.co/s1WVzKT',
        level INT(10) NOT NULL DEFAULT 0
      );`, (err, results, fields) => { 
        if (err) console.log(`Database creation error: ${err}\n`) 
      })
  }

  connectToDatabase(user = "root", password = "72918345", host = "localhost", port = 3306) {
    this.#connection = this.mysql.createConnection({
      host: host,
      user: user,
      database: "race01_db",
      password: password,
      port: port
    })
  }

  showUsers() {
    this.#connection.query("SELECT * FROM `users`", (err, results, fields) => {
      if (err) console.log(`getUsers error: ${err}\n`)
      else console.log(results)
    })
  }

  requestUser(login, onResult) {
    this.#connection.query(`SELECT * FROM users WHERE login = '${login}'`,
    (err, results, fields) => {
      if (err) {
        console.log(`User request error: ${err}\n`)
        onResult(null)
      } else {
        if (results.length >= 1) {
          onResult({login: results[0].login, password_hash: results[0].password_hash})
        }
      }
    })
  }

  registerUser(login, password_hash) {
    this.#connection.query(
      `INSERT INTO users (login, password_hash) 
      VALUES ('${login}', '${password_hash}')`)
  }

  tryRegister(login, password_hash, onResult) {
    this.#connection.query(
      `SELECT * FROM users WHERE login = '${login}'`,
      (err, results, fields) => {
        if (err) {
          console.log(`Registration error: ${err}\n`)
          onResult(false)
        } else {
          if (results.length > 0) {
            console.log("Registration failed!")
            onResult(false)
          } else {
            // REGISTRATION HERE (no users with the same login found)
            console.log(`Registered: ${login} ${password_hash}`)
            this.registerUser(login, password_hash)
            onResult(true)
          }
        }
      }
    )
  }

  tryLogin(login, password_hash, onResult) {
    this.#connection.query(
      `SELECT * FROM users WHERE login = '${login}'`,
      (err, results, fields) => {
        if (err) {
          console.log(`Login error: ${err}\n`)
          onResult(false)
        }
        else {
          if (results.length > 0 && results[0].password_hash == password_hash) {
            console.log("Login approved!")
            onResult(true)
          } else {
            console.log("Login failed!")
            onResult(false)
          }
        }
      }
    )
  }

  checkLogin(login, onResult) {
    this.#connection.query(
      `SELECT * FROM users WHERE login = '${login}'`,
      (err, results, fields) => { onResult(results.length > 0) })
  }
}