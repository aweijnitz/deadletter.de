const assert = require("assert");
const mysql = require("mysql");
const util = require('util');
const config = require('../config/config');

let _dbPool = null; // Singleton


const initDb = () => {
  if (_dbPool) {
    console.warn("Database already initialized!");
    return callback(null, _dbPool);
  }

  let conf = {
    connectionLimit : 5,
    queueLimit: 16,
    host: config.get('db.host'),
    user: config.get('db.user'),
    password: config.get('db.password'),
    database: config.get('db.name')
  };

  console.log(conf);

  _dbPool  = mysql.createPool({
    connectionLimit : 5,
    queueLimit: 16,
    host: config.get('db.host'),
    user: config.get('db.user'),
    password: config.get('db.password'),
    database: config.get('db.name')
  });

  return _dbPool;
};

function getDb() {
  if(!_dbPool)
    return initDb();
  return _dbPool;
}

module.exports = {
  getDb,
  initDb
};
