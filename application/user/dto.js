'use strict';

const { ValidationError } = require('../../utils/error');

const Joi = require('joi');

class UserDto {
    constructor(params) {
        this.name = params.name;
        this.email = params.email;
        this.password = params.password;
    }

    static toCreateDTO(params) {
        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(50).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(15).required()
        });

        const { error } = schema.validate(params);

        if (error) {
            throw new ValidationError(error.message);
        }

        return new UserDto(params);
    }

    static toLoginDTO(params) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(15).required()
        });

        const { error } = schema.validate(params);

        if (error) {
            throw new ValidationError(error.message);
        }

        return new UserDto(params);
    }
}

module.exports = UserDto;
