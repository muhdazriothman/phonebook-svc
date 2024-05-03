class PhoneBookEntry {
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.dateOfBirth = params.dateOfBirth;
        this.mobileNumber = params.mobileNumber;
        this.userId = params.userId;
    }

    static create(params) {
        return new PhoneBookEntry(params);
    }
}

module.exports = PhoneBookEntry;
