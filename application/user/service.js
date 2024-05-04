'use strict';

const bcryptjs = require('bcryptjs');

const User = require('../../domain/entities/user');

const {
    BusinessLogicError
} = require('../../utils/error');

class UserService {
    /**
     * @param {Object} dependencies
     * @param {import('../../infra/repositories/user')} dependencies.userRepository
     */
    constructor(dependencies) {
        const {
            userRepository
        } = dependencies;

        this.userRepository = userRepository;
    }

    static create(dependencies) {
        return new UserService(dependencies);
    }

    /**
     * @param {import('../../application/user/dto')} dto
     */
    async create(dto) {
        const sameEntry = await this.userRepository.getByEmail(dto);

        if (sameEntry) {
            throw new BusinessLogicError('Found duplicated entry');
        }

        const user = new User({
            id: null,
            name: dto.name,
            email: dto.email,
            password: await UserService.getHashedPassword(dto.password)
        });

        return await this.userRepository.create(user);
    }

    static async getHashedPassword(password) {
        return await bcryptjs.hash(password, 10);
    }
}

module.exports = UserService;
