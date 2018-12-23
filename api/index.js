const express = require('express');
const sqlinjection = require('sql-injection');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
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
  app.enable("trust proxy");
  const pool = await initDb();

  app.use(helmet());
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // window in minutes
    max: 50 // limit each IP to N requests per windowMs
  });
  app.use(limiter);
  app.configure(function() {
    app.use(sqlinjection);  // add sql-injection middleware
  });

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
