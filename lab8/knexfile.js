// Update with your config settings.
const databaseConfiguration = require('./config/database.json');

module.exports = {
  development: {
    client: 'mysql2',
    connection: databaseConfiguration.development,
  },
  migrations: {
    directory: './migrations/development',
  },
  seeds: {
    directory: './seeds/development',
  },
};
