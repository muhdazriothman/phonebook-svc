const Effect = {
    Allow: 'Allow',
    Deny: 'Deny'
};

class Principal {
    static Effect = Effect;

    constructor(params) {
        this.principalId = params.principalId;
        this.policyDocument = params.policyDocument;
        this.context = params.context;
    }

    static createForAllow(params) {
        return new Principal({
            principalId: params.principalId,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: Effect.Allow,
                        Resource: params.resource
                    }
                ]
            },
            context: params.context
        });
    }

    static createForDeny(params) {
        return new Principal({
            principalId: params.principalId,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: Effect.Deny,
                        Resource: params.resource
                    }
                ]
            }
        });
    }
}

module.exports = Principal;
