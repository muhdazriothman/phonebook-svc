'use strict';

const { ValidationError } = require('../../utils/error');

const Joi = require('joi');

class PhoneBookEntryDto {
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.dateOfBirth = params.dateOfBirth;
        this.mobileNumber = params.mobileNumber;
    }

    static toCreateDTO(params) {
        const schema = Joi.object({
            name: Joi.string().trim().min(1).required(),
            dateOfBirth: Joi.date().iso().max('now').required(),
            mobileNumber: Joi.string().pattern(/^[0-9]+$/).min(8).max(15).required()
        });

        const { error } = schema.validate(params);

        if (error) {
            throw new ValidationError(`Invalid payload: ${error.message}`);
        }

        return new PhoneBookEntryDto(params);
    }

    static toUpdateDTO(params) {
        const schema = Joi.object({
            id: Joi.number().integer().min(1).required(),
            name: Joi.string().trim().min(1).required(),
            dateOfBirth: Joi.date().iso().max('now').required(),
            mobileNumber: Joi.string().pattern(/^[0-9]+$/).min(8).max(15).required()
        });

        const { error } = schema.validate(params);

        if (error) {
            throw new ValidationError(`Invalid payload: ${error.message}`);
        }

        return new PhoneBookEntryDto(params);
    }
}

module.exports = PhoneBookEntryDto;
