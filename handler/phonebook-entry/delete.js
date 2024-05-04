'use strict';

const PhoneBookEntryService = require('../../application/phonebook-entry/service');
const PhoneBookEntryRepository = require('../../infra/repositories/phonebook-entry');

const {
    ValidationError,
    resolveError
} = require('../../utils/error');

exports.handler = async (event) => {
    try {
        if (!event) {
            throw new ValidationError('Empty event');
        }

        const {
            pathParameters,
            requestContext
        } = event;

        if (!pathParameters || !pathParameters.id) {
            throw new ValidationError('Empty path parameter');
        }

        const userId = Number(requestContext.authorizer.id);
        const id = Number(pathParameters.id);

        const phoneBookEntryService = PhoneBookEntryService.create({
            phoneBookEntryRepository: PhoneBookEntryRepository.create()
        });

        await phoneBookEntryService.delete({
            userId: userId,
            id: id
        });

        return {
            statusCode: 200,
            body: { message: 'Phonebook entry deleted' },
        };
    } catch (error) {
        const errorResponse = resolveError(error);
        return errorResponse;
    }
};

