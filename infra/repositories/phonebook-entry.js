'use strict';

const luxon = require('luxon');

const PhoneBookEntry = require('../../domain/entities/phonebook-entry');

const PostgresClient = require('../postgres/client');

const {
    DatabaseError
} = require('../../utils/error');

class PhoneBookEntryRepository {
    /**
     * @param {Object} dependencies
     * @param {import('../postgres/client')} dependencies.postgresClient
     */
    constructor(dependencies) {
        this.postgresClient = dependencies.postgresClient;
    }

    static create() {
        return new PhoneBookEntryRepository({
            postgresClient: PostgresClient.create()
        });
    }

    static toDomain(record) {
        return PhoneBookEntry.create({
            id: record.id,
            name: record.name,
            dateOfBirth: luxon.DateTime.fromJSDate(record.date_of_birth).toFormat('yyyy-MM-dd'),
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

        const query = 'INSERT INTO phonebook_entries (user_id, name, date_of_birth, mobile_number) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [userId, name, dateOfBirth, mobileNumber];

        try {
            const result = await this.postgresClient.execute(query, values);
            return PhoneBookEntryRepository.toDomain(result[0]);
        } catch (error) {
            console.log('create: ', error);
            throw new DatabaseError('Database error occured');
        }
    }

    async getByNameAndMobileNumber(dto) {
        const {
            name,
            mobileNumber,
            userId
        } = dto;

        const query = 'SELECT * FROM phonebook_entries WHERE user_id = $1 AND name = $2 AND mobile_number = $3';
        const values = [userId, name, mobileNumber];

        try {
            const result = await this.postgresClient.execute(query, values);

            if (result.length === 0) {
                return null;
            }

            return PhoneBookEntryRepository.toDomain(result[0]);
        } catch (error) {
            console.log('getByNameAndMobileNumber: ', error);
            throw new DatabaseError('Database error occured');
        }
    }

    async listByUserId(userId) {
        const query = 'SELECT * FROM phonebook_entries WHERE user_id = $1';
        const values = [userId];

        try {
            const result = await this.postgresClient.execute(query, values);

            const phoneBookEntries = [];

            for (const record of result) {
                phoneBookEntries.push(PhoneBookEntryRepository.toDomain(record));
            }

            return phoneBookEntries;
        } catch (error) {
            console.log('listByUserId: ', error);
            throw new DatabaseError('Database error occured');
        }
    }

    updateById(dto, userId) {
        const {
            id,
            name,
            dateOfBirth,
            mobileNumber
        } = dto;

        const query = 'UPDATE phonebook_entries SET name = $1, date_of_birth = $2, mobile_number = $3 WHERE user_id = $4 AND id = $5 RETURNING *';
        const values = [name, dateOfBirth, mobileNumber, userId, id];

        try {
            return this.postgresClient.execute(query, values);
        } catch (error) {
            console.log('updateById: ', error);
            throw new DatabaseError('Database error occured');
        }
    }

    async deleteById(params) {
        const {
            userId,
            id
        } = params;

        const query = 'DELETE FROM phonebook_entries WHERE user_id = $1 AND id = $2';
        const values = [userId, id];

        try {
            await this.postgresClient.execute(query, values);
        } catch (error) {
            console.log('deleteById: ', error);
            throw new DatabaseError('Database error occured');
        }
    }
}

module.exports = PhoneBookEntryRepository;
