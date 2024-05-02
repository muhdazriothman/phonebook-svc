const {
    ValidationError
} = require('./error');

function parseJsonString(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        throw new ValidationError('Invalid JSON');
    }
}

module.exports = {
    parseJsonString,
};