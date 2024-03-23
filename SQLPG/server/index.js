require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const router = require('./router.js');

const db = require('../database/db.js');

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on on port ${PORT}`);
});

app.use(express.json());
app.use(morgan('dev'));


app.use('/api', router);
