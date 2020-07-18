const bcrypt = require('bcrypt');
const crypto = require('crypto');
const tableOrdered = require('../src/constants/tableOrdered');
const tableNames = require('../src/constants/tableNames');
const countries = require('../src/constants/countries');
const states = require('../src/constants/states');

let password_ = '';
const password = crypto.randomBytes(15).toString('hex');
  const hash = bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash("jyoti123", salt, (err, hash) => {
      console.log("hash --->", hash);
      password_ = hash;
      return hash;
    });

    if(bcrypt.compare('jyoti123', password_)){
      console.log("dksd")
    };

    // if(err) throw err;
  });

console.log("hash_ ---> ", password_);


exports.seed = async knex => {
  // Deletes ALL existing entries
  tableOrdered.reduce(async(promise, table_name) =>{
    await promise;
    console.log("clearing table name ", table_name);
    return knex(table_name).del();
  }, Promise.resolve()); 
  await Promise.all(tableOrdered.map(tableOrder => knex(tableOrder).del()));
  const password = crypto.randomBytes(15).toString('hex');
  const user = {
    email: 'garden@jyoto.com',
    name: 'garden_jyoto',
    password: await bcrypt.hash("jyoti123", 10),
  };
  // await knex(tableNames.user).insert(user).returning('*');
  const createdUser= await knex(tableNames.user).insert(user)
  // .returning('*');
  console.log('created user -->', createdUser);

  await knex(tableNames.country).insert(
    // countries.map(country => country)
    countries
  );

  await knex(tableNames.state).insert(states);
};
