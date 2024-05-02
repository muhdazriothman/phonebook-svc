'use strict';

const pg = require('pg');
const SecretManagerClient = require('../secret-manager/client');

class PostgresClient {
  constructor() {
    this.secretManagerClient = new SecretManagerClient();
    this.client = null; // Client is initially null until connected
  }

  static create() {
    return new PostgresClient();
  }

  async connect() {
    if (this.client && this.client._ending) {
      throw new Error('Client is already closing or closed.');
    }

    if (!this.client) {
      const secret = await this.secretManagerClient.getSecret(SecretManagerClient.getSecretName('db'));

      this.client = new pg.Client({
        user: secret.user,
        password: secret.password,
        host: secret.host,
        port: secret.port,
        database: secret.database,
        ssl: {
          rejectUnauthorized: false,
          cert: secret.cert,
        },
      });

      await this.client.connect();
      console.log('Connected to PostgreSQL database!');
    }
  }

  async disconnect() {
    if (this.client && !this.client._ending) {
      await this.client.end();
      console.log('Connection to PostgreSQL closed.');
    }
  }

  async execute(query, values) {
    try {
      await this.connect();

      const result = await this.client.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error executing PostgreSQL query:', error.message);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

module.exports = PostgresClient;
