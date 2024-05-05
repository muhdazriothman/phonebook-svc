'use strict';

const PhoneBookEntryDto = require('../../application/phonebook-entry/dto');
const PhoneBookEntryService = require('../../application/phonebook-entry/service');
const PhoneBookEntryRepository = require('../../infra/repositories/phonebook-entry');

const jsonUtils = require('../../utils/json');

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
            body,
            requestContext
        } = event;

        if (!pathParameters || !pathParameters.id) {
            throw new ValidationError('Empty path parameter');
        }

        if (!body) {
            throw new ValidationError('Empty payload');
        }

        const parsedBody = jsonUtils.parseJsonString(body);

        const userId = Number(requestContext.authorizer.id);
        const id = Number(pathParameters.id);

        const dto = PhoneBookEntryDto.toUpdateDTO({
            id: id,
            name: parsedBody.name,
            dateOfBirth: parsedBody.dateOfBirth,
            mobileNumber: parsedBody.mobileNumber,
            userId: userId,
        });

        const phoneBookEntryService = PhoneBookEntryService.create({
            phoneBookEntryRepository: PhoneBookEntryRepository.create(),
        });

        const result = await phoneBookEntryService.update(dto);

        return {
            statusCode: 200,
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
