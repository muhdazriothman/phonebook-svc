'use strict';

const {
    BusinessLogicError
} = require('../../utils/error');

class PhoneBookEntryService {
    /**
     * @param {Object} dependencies
     * @param {import('../../infra/repositories/phonebook-entry')} dependencies.phoneBookEntryRepository
     */
    constructor(dependencies) {
        const {
            phoneBookEntryRepository
        } = dependencies;

        this.phoneBookEntryRepository = phoneBookEntryRepository;
    }

    static create(dependencies) {
        return new PhoneBookEntryService(dependencies);
    }

    async create(dto) {
        const sameEntry = await this.phoneBookEntryRepository.getByNameAndMobileNumber(dto);

        if (sameEntry) {
            throw new BusinessLogicError('Similar entry already exists');
        }

        return await this.phoneBookEntryRepository.create(dto);
    }

    async list(userId) {
        return await this.phoneBookEntryRepository.listByUserId(userId);
    }

    async update(dto) {
        const sameEntry = await this.phoneBookEntryRepository.getByNameAndMobileNumber(dto);

        if (sameEntry && sameEntry.id !== dto.id) {
            throw new BusinessLogicError('Similar entry already exists');
        }

        return await this.phoneBookEntryRepository.updateById(dto);
    }

    async delete(params) {
        const phoneBookEntry = await this.phoneBookEntryRepository.getById(params);

        if (!phoneBookEntry) {
            throw new BusinessLogicError('Phonebook entry not found');
        }

        return await this.phoneBookEntryRepository.deleteById(params);
    }
}

module.exports = PhoneBookEntryService;
