module.exports = {
  serverPort: 8181, 

  session: {
    key: "session-key",
    maxAge: 5000,
    httpOnly: false,
    renew: true
  },

  database: {
    host: "localhost",
    user: "root",
    password: "root",
    database: "diary",
    port: 3306
  }
}