const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-1' });

const SecretKey = {
    db: 'bursa-phonebook-db-secret',
    user: 'bursa-phonebook-user-secret'
};
class SecretManagerClient {
    static SecretKey = SecretKey;

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

            const parsedSecret = JSON.parse(data.SecretString);

            this.cachedSecret[secretName] = parsedSecret;

            return parsedSecret;
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
}

module.exports = SecretManagerClient;
