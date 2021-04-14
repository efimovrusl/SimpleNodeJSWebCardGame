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

  getUsers() {
    this.#connection.query("SELECT * FROM `users`", (err, results, fields) => {
      if (err) console.log(`Error: ${err}\n`)
      else console.log(results)
    })
  }

  registerUser(login, password_hash) {
    this.#connection.query(
    )
    this.#connection.query(
      `INSERT INTO users (login, password_hash) 
      VALUES ('${login}', '${password_hash}')`)
  }

  tryLogin(login, password_hash, onResult) {
    let result = 2
    this.#connection.query(
      `SELECT * FROM users WHERE login = '${login}'`,
      (err, results, fields) => {
        if (err) {
          console.log(`Error: ${err}\n`)
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
    console.log("RESULT: " + result)
  }
}