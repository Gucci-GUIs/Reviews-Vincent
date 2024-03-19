const mysql = require('mysql2');

// console.log('VINCENT ENV TEST: ', process.env.DB_USER);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

});

connection.connect((err) => {
  if (err) {
    console.error('ERROR: DB connection');
  } else {
    console.log('SUCCESS: DB connected');
  }
});

module.exports = connection;
