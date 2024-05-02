'use strict';

const {
    BusinessLogicError
} = require('../../utils/error');

class PhoneBookEntryService {
    constructor(dependencies) {
        const {
            phoneBookEntryRepository 
        } = dependencies;

        this.phoneBookEntryRepository = phoneBookEntryRepository;
    }

    static create(dependencies) {
        return new PhoneBookEntryService(dependencies);
    }

    async createPhoneBookEntry(dto) {
        const sameEntry = await this.phoneBookEntryRepository.getPhoneBookEntryByNameAndMobileNumber(dto);

        if (sameEntry.length > 0) {
            throw new BusinessLogicError('Found duplicated entry');
        }

        return await this.phoneBookEntryRepository.createPhoneBookEntry(dto);
    }

    async listPhoneBookEntry(userId) {
        return await this.phoneBookEntryRepository.getPhoneBookEntryByUserId(userId);
    }

    async deletePhoneBookEntry(params) {
        return await this.phoneBookEntryRepository.deletePhoneBookEntryById(params);
    }
}

module.exports = PhoneBookEntryService;
