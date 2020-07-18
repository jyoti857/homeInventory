const addDefaultColumns = (table) => {
  table.timestamps(true, true);
  // table.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
  // table.timestamp('updated_at', { precision: 6 }).defaultTo(knex.fn.now(6));
  // table.datetime('created_at').notNullable().default(Knex.fn.now());
  // table.datetime('updated_at').notNullable().default(Knex.fn.now());
  table.datetime('deleted_at');
};


// helper function: for creating email column
function emailColumn(table, columnName){
  return table.string(columnName, 244); // email max length should be 254
};


// helper function: for creating url column 
function urlColumn(table, columnName){
  return table
    .string(columnName, 2000);
};

// helper function : for creating references(FK)
function createReferenceColumn(table, tableName, notNullable = true){
  const defination = table
          .integer(`${tableName}_id`)
          .unsigned().references('id')
          .inTable(tableName)
          .onDelete('CASCADE');

    if(notNullable){
      defination.notNullable();
    }
    // return defination;
};


// create a reusable function for creating tables having same number of columns and same datatype
const createNameTable = (knex, tableName) => {
  return knex.schema.createTable(tableName, table => {
    table.increments().notNullable();
    table.string('name').notNullable().unique();
    addDefaultColumns(table);
  })
};


module.exports = {
  urlColumn, 
  emailColumn, 
  addDefaultColumns, 
  createReferenceColumn, 
  createNameTable
}
