const { faker } = require('@faker-js/faker');

const FieldType = {
    ANIMAL: () => faker.animal.type(),
    BIRTHDATE: () => faker.date.birthdate(),
    CITY: () => faker.address.city(),
    COLOR: () => faker.color.human(),
    EMAIL: () => faker.internet.email(),
    FINANCE: () => faker.finance.amount(),
    FULL_NAME: () => faker.name.fullName(),
    GIVEN_NAME: () => faker.name.firstName(),
    GENRE: () => faker.music.genre(),
    PARAGRAPH: () => faker.lorem.paragraph(),
    PASSWORD: () => faker.internet.password(),
    PATHNAME: () => faker.system.directoryPath(),
    PHONE: () => faker.phone.number(),
    SEX: () => faker.name.sex(),
    SURNAME: () => faker.name.lastName(),
    USERNAME: () => faker.internet.userName(),
    UUID: () => faker.datatype.uuid(),
    ZIP: () => faker.address.zipCode()
};

const randomRecord = (fieldEntries) =>
    fieldEntries.reduce((record, [field, type]) => {
        try {
            record[field] = FieldType[type]();
        } catch (e) {
            console.err(`Invalid field type: ${type}`);
        }
        return record;
    }, {});

const randomRecords = (count, fields) => {
    const records = [];
    const fieldEntries = Object.entries(fields);
    for (let i = 0; i < count; i++) {
        records.push(randomRecord(fieldEntries));
    }
    return records;
}

module.exports = { randomRecord, randomRecords };