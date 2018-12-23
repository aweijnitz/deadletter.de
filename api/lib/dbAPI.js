const util = require('util');
const mysql = require("mysql");
const retry = require('async-retry');
const config = require('../config/config');

let _dbPool = null; // Singleton

const createTableSQL = `
CREATE TABLE \`uploads\` (
  \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  \`filename\` varchar(512) NULL DEFAULT 'unnamed',
  \`created_on\` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  \`path\` varchar(512) NULL,
  \`md5hash\` char(32) NOT NULL,
  \`last_download_on\` datetime NULL,
  \`accesscount\` int NULL
);
`;

const addFileSQL = `
INSERT INTO \`uploads\` (\`filename\`, \`created_on\`, \`path\`, \`md5hash\`, \`last_download_on\`, \`accesscount\`)
VALUES ('my_first upload üäö', now(), '/some/path', '1293234849230423', NULL, NULL);
`;

const ensureSchema = async () => {
  try {
    console.log('Ensuring schema and DB connection');
    try {
      let tableCheck = await _dbPool.query('SELECT 1 FROM uploads LIMIT 1;');
      console.log('TABLE EXISTS!', util.inspect(tableCheck, false, 4));
    } catch (tableMissingErr) {
      console.log(tableMissingErr.code);
      console.log('No table found. Creating table!');
      return await _dbPool.query(createTableSQL);
    }
  } catch (err) {
    console.log('Ensuring schema ERR ' + err.code);
    throw new Error(err);
  }

};

const closeDB = async () => {
  console.log('Closing all database connections');
  return _dbPool ? _dbPool.end() : null;
};

/**
 * Create db conection pool and ensure db schema present
 *
 * @return {Promise<*>}
 */
const initDb = async () => {
  if (_dbPool)
    return _dbPool;

  const poolConf = {
    connectionLimit: 5,
    queueLimit: 16,
    host: config.get('db.host'),
    user: config.get('db.user'),
    password: config.get('db.password'),
    database: config.get('db.name')
  };

  try {
    _dbPool = await mysql.createPool(poolConf);
    _dbPool.query = util.promisify(_dbPool.query); // See https://medium.com/@matthagemann/create-a-mysql-database-middleware-with-node-js-8-and-async-await-6984a09d49f4
    _dbPool.end = util.promisify(_dbPool.end);
    let result = await retry(ensureSchema, {
      retries: 8,
      maxTimeout: 120 * 1000,
      onRetry: (err) => {
        console.log('Retry - Attempt failed with ' + err);
      }
    });

  } catch (err) {
    console.log('ERROR TERROR - COULD NOT INITIALIZE DB!');
    throw err;
  }
  console.log('DB initialized');

  return _dbPool;
};

const getDbPool = function getDbPool() {
  if (!_dbPool)
    return initDb();
  return _dbPool;
};

module.exports = {
  getDbPool,
  initDb,
  closeDB
};
