const sinon = require('sinon');
const should = require('should');

const PhoneBookEntryRepository = require('./repository');
const PhoneBookEntry = require('../../../domain/entities/phonebook-entry');

const PostgresClient = require('../../postgres/client');

const {
    DatabaseError
} = require('../../../utils/error');

describe('phonebook-svc/infra/repositories/phonebook-entry/repository', () => {
    const sandbox = sinon.createSandbox();

    let repository;

    const entry = [
        {
            id: 1,
            name: 'John Doe',
            date_of_birth: '1990-01-01',
            mobile_number: '123456789',
            user_id: 1
        },
        {
            id: 2,
            name: 'Jane Doe',
            date_of_birth: '1990-01-01',
            mobile_number: '1234567890',
            user_id: 1
        }
    ]

    beforeEach(() => {
        sandbox.stub(PostgresClient.prototype, 'execute');

        sandbox.spy(PhoneBookEntryRepository, 'toDomain');
        
        repository = new PhoneBookEntryRepository({
            postgresClient: new PostgresClient()
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('#create', () => {
        it('should create a new phone book entry', async () => {
            const entity = new PhoneBookEntry({
                name: 'John Doe',
                dateOfBirth: '1990-01-01',
                mobileNumber: '123456789',
                userId: 1
            });
    
            PostgresClient.prototype.execute.resolves([entry[0]]);
    
            const result = await repository.create(entity);
        
            should(PhoneBookEntryRepository.toDomain.calledOnce).be.true();
            should(PhoneBookEntryRepository.toDomain.calledWith(entry[0])).be.true();
            
            should(PostgresClient.prototype.execute.calledOnce).be.true();
            should(PostgresClient.prototype.execute.calledWith(
                'INSERT INTO phone_book_entries (user_id, name, date_of_birth, mobile_number) VALUES ($1, $2, $3, $4) RETURNING *',
                [1, 'John Doe', '1990-01-01', '123456789']
            )).be.true();
        
            should(result).deepEqual(new PhoneBookEntry({
                id: 1,
                name: 'John Doe',
                dateOfBirth: '1990-01-01',
                mobileNumber: '123456789',
                userId: 1
            }));
        });

        it('should handle error when creating a new phone book entry', async () => {
            const entity = new PhoneBookEntry({
                name: 'John Doe',
                dateOfBirth: '1990-01-01',
                mobileNumber: '1234567890'
            });
    
            PostgresClient.prototype.execute.rejects(new DatabaseError('Database error occured'));
    
            try {
                await repository.create(entity);
            } catch (error) {
                should(error.message).be.equal('Database error occured');
            }
        });
    });

    describe('#getByNameAndMobileNumber', () => {
        it('should get by name and mobile number', async () => {
            const params = {
                userId: 1,
                name: 'John Doe',
                mobileNumber: '1234567890'
            };

            const record = {
                id: 1,
                name: 'John Doe',
                date_of_birth: '1990-01-01',
                mobile_number: '1234567890',
                user_id: 1
            };

            PostgresClient.prototype.execute.resolves([record]);

            const result = await repository.getByNameAndMobileNumber(params);

            should(PhoneBookEntryRepository.toDomain.calledOnce).be.true();
            should(PhoneBookEntryRepository.toDomain.calledWith(record)).be.true();

            should(PostgresClient.prototype.execute.calledOnce).be.true();
            should(PostgresClient.prototype.execute.calledWith(
                'SELECT * FROM phone_book_entries WHERE user_id = $1 AND name = $2 AND mobile_number = $3',
                [1, 'John Doe', '1234567890']
            )).be.true();

            should(result).be.instanceOf(PhoneBookEntry);

            should(result).deepEqual(new PhoneBookEntry({
                id: 1,
                name: 'John Doe',
                dateOfBirth: '1990-01-01',
                mobileNumber: '1234567890',
                userId: 1
            }));
        });

        it('should handle error when getting by name and mobile number', async () => {
            const params = {
                userId: 1,
                name: 'John Doe',
                mobileNumber: '1234567890'
            };

            PostgresClient.prototype.execute.rejects(new DatabaseError('Unexpected error occured'));

            try {
                await repository.getByNameAndMobileNumber(params);
            } catch (error) {
                should(error.message).be.equal('Database error occured');
            }
        });
    });

    describe('#listByUserId', () => {
        it('should list by user id', async () => {
            const userId = 1;

            PostgresClient.prototype.execute.resolves(entry);

            const result = await repository.listByUserId(userId);

            should(PhoneBookEntryRepository.toDomain.calledTwice).be.true();
            should(PhoneBookEntryRepository.toDomain.calledWith(entry[0])).be.true();
            should(PhoneBookEntryRepository.toDomain.calledWith(entry[1])).be.true();

            should(PostgresClient.prototype.execute.calledOnce).be.true();
            should(PostgresClient.prototype.execute.calledWith(
                'SELECT * FROM phone_book_entries WHERE user_id = $1',
                [1]
            )).be.true();

            should(result).be.Array();
            should(result).length(2);

            should(result[0]).deepEqual(new PhoneBookEntry({
                id: 1,
                name: 'John Doe',
                dateOfBirth: '1990-01-01',
                mobileNumber: '123456789',
                userId: 1
            }));

            should(result[1]).deepEqual(new PhoneBookEntry({
                id: 2,
                name: 'Jane Doe',
                dateOfBirth: '1990-01-01',
                mobileNumber: '1234567890',
                userId: 1
            }));
        });

        it('should handle error when listing by user id', async () => {
            const userId = 1;

            PostgresClient.prototype.execute.rejects(new DatabaseError('Unexpected error occured'));

            try {
                await repository.listByUserId(userId);
            } catch (error) {
                should(error.message).be.equal('Database error occured');
            }
        });

        it('should return empty array when no records found', async () => {
            const userId = 1;

            PostgresClient.prototype.execute.resolves([]);

            const result = await repository.listByUserId(userId);

            should(result).be.Array();
            should(result).length(0);
        });
    });

    describe('#delete', () => {
        it('should delete by id', async () => {
            const params = {
                userId: 1,
                id: 1
            };

            PostgresClient.prototype.execute.resolves();

            await repository.delete(params);

            should(PostgresClient.prototype.execute.calledOnce).be.true();
            should(PostgresClient.prototype.execute.calledWith(
                'DELETE FROM phone_book_entries WHERE user_id = $1 AND id = $2',
                [1, 1]
            )).be.true();
        });

        it('should handle error when deleting by id', async () => {
            const params = {
                userId: 1,
                id: 1
            };

            PostgresClient.prototype.execute.rejects(new DatabaseError('Database error occured'));

            try {
                await repository.delete(params);
            } catch (error) {
                should(error.message).be.equal('Database error occured');
            }
        });
    });
});
