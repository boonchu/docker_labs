// put this at ./provisioning/wait-for-mysql.js

const mysql = require('mysql2');
const database = require('../config/database.json');
if(typeof process.env.NODE_ENV === 'undefined') {
  throw new Error('NODE_ENV is not defined');
}
const environment = process.env.NODE_ENV;
const connection = mysql.createConnection(database[environment]);

let retryCounter = 0;
const retryCountMax = 60;

(function retryConnectTillSucceed() {
  console.info(`Checking MySQL connection on port ${database[environment].port}...`);
  connection.connect((err) => {
    if(err) {
      console.info('MySQL connection failed. Stack trace as follows:');
      console.error(err.stack);
      if(++retryCounter >= retryCountMax) { process.exit(1); }
      else { setTimeout(retryConnectTillSucceed, 1000); }
    } else {
      console.info('MySQL connection succeeded!');
      process.exit(0);
    }
  });
})();
