'use strict';

const User = require('../../domain/entities/user');

const PostgresClient = require('../postgres/client');

const {
    DatabaseError
} = require('../../utils/error');

class UserRepository {
    /**
     * @param {Object} dependencies
     * @param {import('../postgres/client')} dependencies.postgresClient
     */
    constructor(dependencies) {
        this.postgresClient = dependencies.postgresClient;
    }

    static create() {
        return new UserRepository({
            postgresClient: PostgresClient.create()
        });
    }

    static toDomain(record) {
        return new User({
            id: record.id,
            name: record.name,
            email: record.email,
            password: record.password
        });
    }

    async create(entity) {
        const {
            name,
            email,
            password
        } = entity;

        const query = 'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *';
        const values = [name, email, password];

        try {
            const result = await this.postgresClient.execute(query, values);
            return UserRepository.toDomain(result[0]);
        } catch (error) {
            console.log('create: ', error);
            throw new DatabaseError('Database error occured');
        }
    }

    async getByEmail(params) {
        const {
            email
        } = params;

        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];

        try {
            const result = await this.postgresClient.execute(query, values);

            if (result.length === 0) {
                return null;
            }

            return UserRepository.toDomain(result[0]);
        } catch (error) {
            console.log('getByEmail: ', error);
            throw new DatabaseError('Database error occured');
        }
    }
}

module.exports = UserRepository;
