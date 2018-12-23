const express = require('express');
const config = require('./config/config.js');
const initDb = require('./lib/dbAPI').initDb;
const getDbPool = require('./lib/dbAPI').getDbPool;
const closeDb = require('./lib/dbAPI').closeDB;
const mountShutdownHandlers = require('./lib/mounShutdownHandlers').mountShutdownHandlers;

const applicationShutdown = async () => {
  return await closeDb();
};
mountShutdownHandlers(applicationShutdown);


const service = async function () {

  const app = express();
  const pool = await initDb();

  app.get('/', function (req, res) {

    try {
      res.send('Hello World!');
    } catch (err) {
      res.send('ERROR ' + err.code);
    }

  });

  let server = app.listen(config.get('port'), function () {
    let adr = server.address();
    console.log('Example app listening on port ' + adr.port);
  });

};

let p = service();
