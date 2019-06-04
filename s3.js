const AWS = require('aws-sdk');
const credentials = new AWS.SharedIniFileCredentials({profile: 'zhy'});
AWS.config.credentials = credentials;
const fs = require('fs');

const s3 = new AWS.S3({
  region: 'cn-northwest-1'
});

fs.readFile('./jwt.zip', function (err, data) {
  if (err) { throw err }

  const params = {Bucket: 'joeshi', Key: 'tmp/jwt.zip', Body: data };

  s3.putObject(params, function (err, data) {
    if (err) {
      console.error(err)
    } else {
      console.log('upload successfully!')
    }
  })

});




