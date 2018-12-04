'use strict';

const AWS = require('aws-sdk');

const logAgent = new AWS.CloudWatchLogs({
  region: 'cn-northwest-1'
});

const timestamp = Date.now();

console.log(timestamp);

const params = {
  logEvents: [
    {
      message: 'test',
      timestamp: timestamp
    }
  ],
  logGroupName: '/cloudwatch-logs/demo',
  logStreamName: 'first',


}

logAgent.putLogEvents(params).promise().then(() => {
  console.log('put events')
}).catch(err => {
  console.error(err)
})
