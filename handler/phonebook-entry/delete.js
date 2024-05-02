'use strict';

const PhoneBookEntryService = require('../../application/phonebook-entry/service');
const PhoneBookEntryRepository = require('../../infra/repositories/phonebook-entry');

const { 
  resolveError
} = require('../../utils/error');

exports.handler = async (event) => {
  try {
   // TODO - get user id from event
    const userId = 1;

    const phoneBookEntryService = PhoneBookEntryService.create({
      phoneBookEntryRepository: PhoneBookEntryRepository.create()
    });

    const result = await phoneBookEntryService.deletePhoneBookEntry({
      userId: userId,
      phoneBookEntryId: event.pathParameters.id
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    const errorResponse = resolveError(error);
    return errorResponse;
  }
};

