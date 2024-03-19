let mysql = require('mysql2');

console.log("VINCENT ENV TEST: ",process.env.DB_USER)
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DB

});

connection.connect((err)=>{
  if (err){
    console.error("ERROR: DB connection")
  } else {
    console.log("SUCCESS: DB connected")
  }
});

let getData = function(callback) {
  let query = 'SELECT * FROM students'
  connection.query(query, function(err, results) {
    if(err) {
      console.error("QUERY ERROR :", err);
      callback(err);
    } else {
      callback(null, results)
    }
  })
}
let create = function(data, callback) {
  let query = "INSERT INTO students(name, age, email) VALUES (?,?,?)"
  dataArray = [data.name, data.age, data.email]
  connection.query(query, dataArray, function(err, results) {
    if(err) {
      console.error("QUERY ERROR :", err);
      callback(err);
    } else {
      callback(null, results)
    }
  })
}
let update = function(data, callback) {
  let query = "UPDATE students SET name=?, age=?, email=? WHERE id=?"
  let dataArray = [data.name, data.age, data.email, data.id]
  connection.query(query, dataArray, function (err, results) {
    if(err) {
      console.error("QUERY ERROR :", err);
      callback(err);
    } else {
      callback(null, results)
    }
  })
}
let remove = function (data, callback) {
  let query = "DELETE FROM students WHERE id=?"
  let dataArray = [data]
  connection.query(query, data, function(err, results) {
    if(err) {
      console.error("QUERY ERROR :", err);
      callback(err);
    } else {
      callback(null, results)
    }
  })
}

module.exports = connection
module.exports.getData = getData
module.exports.create = create
module.exports.update = update
module.exports.remove = remove