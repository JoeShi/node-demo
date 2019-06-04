const AWS = require('aws-sdk');
// const credentials = new AWS.SharedIniFileCredentials({profile: 'zhy'});
// AWS.config.credentials = credentials;

const convert = new AWS.MediaConvert({region: 'cn-northwest-1', endpoint: 'https://7zehkokgc.mediaconvert.cn-northwest-1.amazonaws.com.cn'});

convert.getJob({
  Id: 'xdfawfadsfdasfadsfdasfasf'
}).promise().then(data => {
  console.log(data)
}).catch(err => {
  console.error(err)
})


