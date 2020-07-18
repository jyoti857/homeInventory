const Knex = require('knex');
const {urlColumn, emailColumn, addDefaultColumns, createReferenceColumn } = require('../src/lib/tableUtils');

const tableNames = require('../src/constants/tableNames');

exports.up = async (knex) => {
  await Promise.all([
    knex.schema.createTable(tableNames.user, (table) => {
      table.increments().notNullable();
      // table.string('email', 254).notNullable().unique();
      emailColumn(table, 'email').notNullable().unique();
      table.string('name').notNullable();
      table.string('password', 120).notNullable();
      table.datetime('last_login');
      addDefaultColumns(table);
    }),
    knex.schema.createTable(tableNames.location, table => {
      table.increments().notNullable();
      table.string('name').notNullable();
      table.string('descriptions', 1000);
      // table.string('image_url', 2000);
      urlColumn(table, 'image_url');
      addDefaultColumns(table);
    }),
    knex.schema.createTable(tableNames.address, table => {
      table.increments().notNullable();
      table.string('street_address_1', 50).notNullable();
      table.string('street_address_2', 50);
      table.string('city', 50).notNullable();
      table.string('zipcode', 15).notNullable();  

      table.float('latitude').notNullable();
      table.float('longitude').notNullable();
      // table.integer('state_id').unsigned().references('id').inTable('state');
      createReferenceColumn(table, 'state', false);
      createReferenceColumn(table, 'country');
      // table.foreign('state').references("state_id").inTable(table);
    }),
    knex.schema.createTable(tableNames.manufacture, table => {
      table.increments();
      table.string('name').notNullable().unique();
      urlColumn(table, 'logo_url');
      table.string('description', 1000);
      urlColumn(table, 'website_url');
      emailColumn(table, 'email');
      createReferenceColumn(table, 'address');
    }),
    createNameTable(knex, tableNames.country),
    createNameTable(knex, tableNames.item_type),
    createNameTable(knex, tableNames.state),
    createNameTable(knex, tableNames.shape),

    // todo: item table
    // drop column country_id from address as the address is linked to the state and state to the country
    await knex.schema.table(tableNames.address, table => {
      table.dropColumn('country_id');
    }),

    // add country_id to the state table
    await knex.schema.table(tableNames.state, table => {
      table.string('code'); 
      createReferenceColumn(table, tableNames.country);
    }),
    await knex.schema.table(tableNames.country, table => {
      table.string('code');  
    }),
    await knex.schema.createTable(tableNames.size, table => {
      table.increments();
      table.string('name', 255).notNullable();
      table.float("length");
      table.float("height");
      table.float("width");
      table.float('volume');
      createReferenceColumn(table, tableNames.shape);
      addDefaultColumns(table);
    })
  ]);

};


// exports.up = async (knex) => {
//   await knex.schema.createTable(tableNames.item_type, (table) => {
//     table.increments().notNullable();
//     table.string('name').notNullable().unique(); // default length is 255
//     addDefaultColumns(table);
//   });
// };

// exports.down = async (knex) => {
//   await knex.schema.dropTable(tableNames.address);
//   await knex.schema.dropTable(tableNames.user);
//   await knex.schema.dropTable(tableNames.item_type);
//   await knex.schema.dropTable(tableNames.state);
//   await knex.schema.dropTable(tableNames.country);
//   await knex.schema.dropTable(tableNames.shape);
//   await knex.schema.dropTable(tableNames.location);
// };

exports.down = async(knex) => {
  await Promise.all([
    tableNames.manufacture,
    tableNames.address,
    tableNames.user, 
    tableNames.item_type, 
    tableNames.state, 
    tableNames.state, 
    tableNames.country, 
    tableNames.shape,
    tableNames.location,
    
  ].map(tableName => knex.schema.dropTable(tableName)));
  await knex.schema.table(tableNames.address, table => {
    createReferenceColumn(table, tableNames.country);
  });
  await knex.schema.table(tableNames.state, table =>{
    table.dropColumn('country_id');
  });
  await knex.schema.dropTable(tableNames.size);
}