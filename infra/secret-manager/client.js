const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-1' });

class SecretsManagerClient {
    constructor() {
        this.secretsManager = new AWS.SecretsManager();
        this.cachedSecret = {};
    }

    async getSecret(secretName) {
        try {
            const secret = this.getCachedSecret(secretName);
            
            if (secret) {
                return secret;
            }

            const data = await this.secretsManager.getSecretValue({ SecretId: secretName }).promise();
        
            return JSON.parse(data.SecretString);
        } catch (err) {
            console.error("Error retrieving secret:", err);
            throw err;
        }
    }

    getCachedSecret(secretName) {
        if (this.cachedSecret[secretName]) {
            return this.cachedSecret[secretName];
        }

        return null;
    }

    static getSecretName(key) {
        const secretConfig = {
            db: 'bursa-phonebook-db-secret'
        };

        return secretConfig[key] || null;
    }
}

module.exports = SecretsManagerClient;
