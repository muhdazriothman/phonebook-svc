class User {
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
        this.password = params.password;
    }

    static create(params) {
        return new User(params);
    }
}

module.exports = User;
