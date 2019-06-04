'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');

const docClient = new AWS.DynamoDB({
    region: 'us-west-2'
});

// start time
let time = new Date().valueOf();

const contacts = JSON.parse(fs.readFileSync('contactInfo-short.json', 'utf-8')).contactInfos;
console.log(contacts.length);

const promises = [];

contacts.forEach(contact => {
    const params = {
        TableName: 'contacts',
        Item: {
            userId: {
                S: 'asdfghjkl'
            },
            contactId: {
                S: contact.contactId
            },
            contactFirstName: {
                S: contact.contactId
            },
            contactFields: {
                S: JSON.stringify(contact.contactFields)
            }
        }
    };
    promises.push(docClient.putItem(params).promise())
});

Promise.all(promises).then(() => {
    time = (new Date().valueOf() - time) / 1000;
    console.log(`finished in ${time} seconds`)
});

