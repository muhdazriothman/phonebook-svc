const PostgresClient = require('../postgres/client');

const {
    DatabaseError
} = require('../../utils/error');

class PhoneBookEntryRepository {
    constructor() {
        this.postgresClient = PostgresClient.create();
    }

    static create() {
        return new PhoneBookEntryRepository();
    }

    async createPhoneBookEntry(params) {
        const { 
            user_id = 1,
            name,
            dateOfBirth,
            mobileNumber
        } = params;

        const query = 'INSERT INTO phone_book_entries (user_id, name, date_of_birth, mobile_number) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [user_id, name, dateOfBirth, mobileNumber];

        try {
            const result = await this.postgresClient.execute(query, values);
            return result[0];
        } catch (error) {
            console.log('Db operation error: ', error.message)
            throw new DatabaseError('Unexpected error occured');
        }
    }

    async getPhoneBookEntryByNameAndMobileNumber(params) {
        const {
            userId = 1,
            name,
            mobileNumber
        } = params;
        const query = 'SELECT * FROM phone_book_entries WHERE user_id = $1 AND name = $2 AND mobile_number = $3';
        const values = [userId, name, mobileNumber];

        try {
            const result = await this.postgresClient.execute(query, values);
            return result; 
        } catch (error) {
            console.log('Db operation error: ', error.message)
            throw new DatabaseError('Unexpected error occured');
        }
    }

    async getPhoneBookEntryByUserId(userId) {
        const userIdMock = 1
        const query = 'SELECT * FROM phone_book_entries WHERE user_id = $1';
        const values = [userIdMock];

        try {
            const result = await this.postgresClient.execute(query, values);
            return result; 
        } catch (error) {
            console.log('Db operation error: ', error.message)
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }

    async deletePhoneBookEntryById(params) {
        const {
            userId,
            phoneBookEntryId
        } = params;

        const query = 'DELETE FROM phone_book_entries WHERE user_id = $1 AND id = $2';
        const values = [userId, phoneBookEntryId];

        try {
            const result = await this.postgresClient.execute(query, values);
            return result; 
        } catch (error) {
            console.log('Db operation error: ', error.message)
            throw new DatabaseError('Unexpected error occured');
        }
    }
}

module.exports = PhoneBookEntryRepository;
