const express = require('express');
const config = require('./config/config.js');
const initDb = require('./lib/dbAPI').initDb;
const getDb = require('./lib/dbAPI').getDb;

const app = express();
const dbConn = initDb();


const applicationShutdown = () => {
  getDb().end();
};

// Be nice process citizen and respect OS signals
process.on('SIGTERM', function () {
  applicationShutdown();
  console.log('SHUTDOWN (TERMINATED)');
  process.exit(0);
});
process.on('SIGINT', function () {
  applicationShutdown();
  console.log('SHUTDOWN (INTERRUPTED)');
  process.exit(0);
});
process.on('SIGTSTP', function () {
  applicationShutdown();
  console.log('SHUTDOWN (STOPPED)');
  process.exit(0);
});


const queryDB = (conn, cb) => {

  conn.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error)
      cb(error);
    else
      cb(null, results);
  });
};


app.get('/', function (req, res) {
  queryDB(dbConn, (err, results) => {
    if (err)
      res.send('ERROR ' + err.code);
    else
      res.send('Hello World! Solution ' + results[0].solution);
  });

});

let server = app.listen(config.get('port'), function () {
  let adr = server.address();
  console.log('Example app listening on port ' + adr.port);
});

