'use strict';

const PhoneBookEntryService = require('../../application/phonebook-entry/service');
const PhoneBookEntryRepository = require('../../infra/repositories/phonebook-entry');

const {
    resolveError
} = require('../../utils/error');

exports.handler = async (event) => {
    try {
        const userId = Number(event.requestContext.authorizer.id);

        const phoneBookEntryService = PhoneBookEntryService.create({
            phoneBookEntryRepository: PhoneBookEntryRepository.create()
        });

        const result = await phoneBookEntryService.list(userId);

        return {
            statusCode: result.length > 0 ? 200 : 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(result)
        };
    } catch (error) {
        const errorResponse = resolveError(error);
        return errorResponse;
    }
};

