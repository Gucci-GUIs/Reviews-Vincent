const { Pool } = require('pg');

const connection = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

});

connection.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

connection.on('error', (err) => {
  console.error('Error connecting to PostgreSQL database', err);
  process.exit(-1);
});

module.exports = connection;

// const pgp = require('pg-promise')(/* initialization options */);

// // const cn = {
// //   host: 'localhost', // server name or IP address;
// //   port: 5432,
// //   database: 'myDatabase',
// //   user: 'myUser',
// //   password: 'myPassword'
// // };
// // alternative:
// // var cn = 'postgres://username:password@host:port/database';

// // database instance;
// const db = pgp({
//   host: 'localhost', // server name or IP address;
//   port: 5432,
//   database: 'myDatabase',
//   user: 'myUser',
//   password: 'myPassword'
// });

// // select and return a single user name from id:
// db.one('SELECT name FROM users WHERE id = $1', [123])
//     .then(user => {
//         console.log(user.name); // print user name;
//     })
//     .catch(error => {
//         console.log(error); // print the error;
//     });

// // alternative - new ES7 syntax with 'await':
// // await db.one('SELECT name FROM users WHERE id = $1', [123]);
