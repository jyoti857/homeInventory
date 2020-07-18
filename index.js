require('dotenv').config();

const knex = require('./knexfile');

// knex();

console.log('knex -->', knex);
const userName = process.env.USER_NAME;
console.log('user name --->', userName);


const express = require('express');

const app = express();
const port = process.env.PORT || 5000;


app.listen(port, () => console.log(`listening on port --> ${port}`));
