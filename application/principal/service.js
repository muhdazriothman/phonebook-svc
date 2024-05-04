'use strict';

const jwt = require('jsonwebtoken');

const SecretManagerClient = require('../../infra/secret-manager/client');

const Principal = require('../../domain/entities/principal');

class PrincipalService {
    static create() {
        return new PrincipalService();
    }

    static async decrypt(token) {
        const secretManagerClient = new SecretManagerClient();

        const {
            passwordKey
        } = await secretManagerClient.getSecret(SecretManagerClient.SecretKey.user);
        console.log('password', passwordKey);

        try {
            const decodedToken = jwt.verify(token, passwordKey);
            console.log('decodedToken: ', decodedToken);

            return {
                valid: true,
                decodedToken
            };
        } catch (error) {
            console.log('error: ', error);
            return {
                valid: false,
                error
            };
        }
    }

    static generatePolicy(params) {
        const {
            valid,
            decodedToken
        } = params;

        if (!valid) {
            return Principal.createForDeny({
                principalId: 'user',
                resource: '*'
            });
        }

        return Principal.createForAllow({
            principalId: decodedToken.email,
            resource: '*',
            context: {
                id: decodedToken.id,
                email: decodedToken.email
            }
        });
    }
}

module.exports = PrincipalService;
