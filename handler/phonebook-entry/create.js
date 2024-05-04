'use strict';

const PhoneBookEntryDto = require('../../application/phonebook-entry/dto');
const PhoneBookEntryService = require('../../application/phonebook-entry/service');
const PhoneBookEntryRepository = require('../../infra/repositories/phonebook-entry');

const jsonUtils = require('../../utils/json');

const { ValidationError, resolveError } = require('../../utils/error');

exports.handler = async (event) => {
    try {
        if (!event || !event.body) {
            throw new ValidationError('Empty payload');
        }

        const userId = Number(event.requestContext.authorizer.id);

        const body = jsonUtils.parseJsonString(event.body);

        const dto = PhoneBookEntryDto.toCreateDTO({
            name: body.name,
            dateOfBirth: body.dateOfBirth,
            mobileNumber: body.mobileNumber,
            userId: userId,
        });

        const phoneBookEntryService = PhoneBookEntryService.create({
            phoneBookEntryRepository: PhoneBookEntryRepository.create(),
        });

        const result = await phoneBookEntryService.create(dto);

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (error) {
        const errorResponse = resolveError(error);
        return errorResponse;
    }
};
