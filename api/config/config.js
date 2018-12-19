const convict = require('convict');
require('dotenv').config();

// Define a schema
const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  port: {
    doc: "The port to bind inside container.",
    format: "port",
    default: 3000,
    env: "PORT",
    arg: "port"
  },
  db: {
    host: {
      doc: "Database host name as defined in docker compose",
      format: '*',
      env: "DB_HOST",
      arg: "DB_HOST",
      default: 'db'
    },
    name: {
      doc: "Database name",
      format: String,
      env: "MYSQL_DATABASE",
      arg: "MYSQL_DATABASE",
      default: 'database'
    },
    user: {
      doc: "Database user for database name",
      format: String,
      env: "MYSQL_USER",
      arg: "MYSQL_USER",
      default: 'user_not_set',
      sensitive: true
    },
    password: {
      doc: "Database password for user",
      format: String,
      env: "MYSQL_PASSWORD",
      arg: "MYSQL_PASSWORD",
      default: 'password_not_set',
      sensitive: true
    },

  }
});

// Load environment dependent configuration
//const env = config.get('env');
//config.loadFile('./config/' + env + '.json');
config.loadFile('./config/application-config.json');
// Perform validation
config.validate({allowed: 'strict'});

module.exports = config;
