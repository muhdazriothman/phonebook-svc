class PhoneBookEntry {
    constructor(params) {
        this.name = params.name;
        this.dateOfBirth = params.dateOfBirth;
        this.mobileNumber = params.mobileNumber;
    }

    static create(params) {
        return new PhoneBookEntry(params);
    }
}

module.exports = PhoneBookEntry;
