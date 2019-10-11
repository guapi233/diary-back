const mysql = require("mysql")
const config = require("../config")
const db = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  port: config.database.port
})

let selectDefault = {
  groupBy: ``,
  having: ``,
  orderBy: ``,
  limit: `` 
}

module.exports = {
  query (sql) {
    return new Promise ((resolve, reject) => {
      db.query(sql, (err, res) => {
        if (err) {reject(err)}

        resolve(res)
      })
    })
  },

  cSelect (data, table, where, extra = selectDefault) {
    if (data !== "*") {data = data.join(",")}
    extra.groupBy = extra.groupBy ? `group by ${extra.groupBy}` : ``
    extra.having = extra.having ? `having ${extra.having}` : ``
    extra.orderBy = extra.orderBy ? `order by ${extra.orderBy}` : ``
    extra.limit = extra.limit ? `limit ${extra.limit}` : ``
    let sql = ``
    if (where) {
      for (let key in where) {
        sql += ` ${key} = "${where[key]}" and`
      }
      sql = sql.replace(/and$/, " ")
    }else { sql = `1=1` }

    return this.query(`select ${data} from ${table} where ${sql} ${extra.groupBy} ${extra.having} ${extra.orderBy} ${extra.limit}`, (err, res) => {
      if (err) {reject(err)}
    })
  },

  cUpdate (data, table ,where=`1=1`) {
    let sql = ``
    for (let key in data) {
      sql += `${key} = "${data[key]}",`
    }
    sql = sql.replace(/,$/, " ")

    return this.query(`update ${table} set ${sql} where ${where}`, (err, res) => {
      if (err) {reject(err)}
    })
  },

  cDelete (table, where=`1=1`) {
    return this.query(`delete from ${table} where ${where}`, (err) => {
      if (err) {reject(err)}
    })
  },

  cInsert (data, table) {
    let key = `(`, value = `(`
    
    for (let k in data) {
      key += `${k},`
      value += `"${data[k]}",`
    } 
    key = key.replace(/,$/, ")")
    value = value.replace(/,$/, ")")

    return this.query(`insert into ${table} ${key} values${value}`, (err) => {
      if (err) {reject(err)}
    })
  }
}