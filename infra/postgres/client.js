const SecretManagerClient = require('../secret-manager/client');

const pgp = require('pg-promise')();

class PostgresClient {
  constructor() {
    if (!PostgresClient.instance) {
      this.connectionOptions = null;
      this.db = null;
      PostgresClient.instance = this;
    }

    return PostgresClient.instance;
  }

  static create() {
    return new PostgresClient();
  }

  async connect() {
    if (!this.db) {
      const secretManagerClient = new SecretManagerClient();
      const credentials = await secretManagerClient.getSecret(SecretManagerClient.SecretKey.db);
      
      this.connectionOptions = {
        host: credentials.host,
        port: credentials.port,
        database: credentials.database,
        user: credentials.user,
        password: credentials.password,
        ssl : {
          rejectUnauthorized: false,
          cert: credentials.cert
        }
      };

      this.db = pgp(this.connectionOptions);
    }
  }

  async execute(query, values) {
    try {
      await this.connect();
      return await this.db.any(query, values);
    } catch (error) {
      console.error('Error executing PostgreSQL query:', error.message);
      throw error;
    }
  }
}

module.exports = PostgresClient;