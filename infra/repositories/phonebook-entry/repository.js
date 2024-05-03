'use strict';

const PhoneBookEntry = require('../../../domain/entities/phonebook-entry');

const {
    DatabaseError
} = require('../../../utils/error');

class PhoneBookEntryRepository {
    /**
     * @param {Object} dependencies
     * @param {import('../../postgres/client')} dependencies.postgresClient
     */
    constructor(dependencies) {
        this.postgresClient = dependencies.postgresClient;
    }

    static create(dependencies) {
        return new PhoneBookEntryRepository(dependencies);
    }

    static toDomain(record) {
        return new PhoneBookEntry({
            id: record.id,
            name: record.name,
            dateOfBirth: record.date_of_birth,
            mobileNumber: record.mobile_number,
            userId: record.user_id
        });
    }

    async create(entity) {
        const { 
            userId = 1,
            name,
            dateOfBirth,
            mobileNumber
        } = entity;

        const query = 'INSERT INTO phone_book_entries (user_id, name, date_of_birth, mobile_number) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [userId, name, dateOfBirth, mobileNumber];

        try {
            const result = await this.postgresClient.execute(query, values);
            return PhoneBookEntryRepository.toDomain(result[0]);
        } catch (error) {
            throw new DatabaseError('Database error occured');
        }
    }

    async getByNameAndMobileNumber(params) {
        const {
            userId = 1,
            name,
            mobileNumber
        } = params;
        const query = 'SELECT * FROM phone_book_entries WHERE user_id = $1 AND name = $2 AND mobile_number = $3';
        const values = [userId, name, mobileNumber];

        try {
            const result = await this.postgresClient.execute(query, values);
            return PhoneBookEntryRepository.toDomain(result[0]); 
        } catch (error) {
            throw new DatabaseError('Database error occured');
        }
    }

    async listByUserId(userId) {
        const userIdMock = 1
        const query = 'SELECT * FROM phone_book_entries WHERE user_id = $1';
        const values = [userIdMock];

        try {
            // TODO: Future improvement: Implement pagination
            const result = await this.postgresClient.execute(query, values);

            const phoneBookEntries = [];

            for (const record of result) {
                phoneBookEntries.push(PhoneBookEntryRepository.toDomain(record));
            }
           
            return phoneBookEntries;
        } catch (error) {
            throw new DatabaseError('Database error occured');
        }
    }

    async deleteById(params) {
        const {
            userId,
            id
        } = params;

        const query = 'DELETE FROM phone_book_entries WHERE user_id = $1 AND id = $2';
        const values = [userId, id];

        try {
            await this.postgresClient.execute(query, values);
        } catch (error) {
            throw new DatabaseError('Database error occured');
        }
    }
}

module.exports = PhoneBookEntryRepository;
