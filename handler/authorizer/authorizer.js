'use strict';

const TokenService = require('../../application/principal/service');

exports.handler = async (event) => {
    const token = event.authorizationToken;

    const decryptedToken = await TokenService.decrypt(token);

    const policy = TokenService.generatePolicy(decryptedToken);

    return policy;
};