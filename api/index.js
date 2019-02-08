const express = require('express');
const sqlinjection = require('sql-injection');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const config = require('./config/config.js');
const initDb = require('./lib/dbAPI').initDb;
const closeDb = require('./lib/dbAPI').closeDB;
const mountShutdownHandlers = require('./lib/mounShutdownHandlers').mountShutdownHandlers;

// Process shutdown hook
const applicationShutdown = async () => {
  return await closeDb();
};
mountShutdownHandlers(applicationShutdown);


const service = async function () {

  const pool = await initDb();

  const app = express();
  app.enable("trust proxy");
  app.use(helmet());
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // window in minutes
    max: 10 // limit each IP to N requests per windowMs
  });
  app.use(limiter);
  app.use(sqlinjection);  // add sql-injection middleware

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
p.then(() => {
  console.log('Service DONE');
});
