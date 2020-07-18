const knex = require('../knexfile');

const config = knex()['development'];

module.exports = config;
