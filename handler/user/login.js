'use strict';

const UserDto = require('../../application/user/dto');
const UserService = require('../../application/user/service');
const UserRepository = require('../../infra/repositories/user');

const jsonUtils = require('../../utils/json');

const { ValidationError, resolveError } = require('../../utils/error');

exports.handler = async (event) => {
    try {
        if (!event || !event.body) {
            throw new ValidationError('Empty payload');
        }

        const body = jsonUtils.parseJsonString(event.body);

        const userDto = UserDto.toLoginDTO(body);

        const userService = UserService.create({
            userRepository: UserRepository.create(),
        });

        const result = await userService.login(userDto);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(result),
        };
    } catch (error) {
        const errorResponse = resolveError(error);
        return errorResponse;
    }
};
