'use strict';

const AWS = require('aws-sdk');

const reokgnition = new AWS.Rekognition({
  region: 'us-west-2'
});

const params = {
  CollectionId: 'demo',
  Image: {
    S3Object: {
      Bucket: 'joeshi',
      Name: 'PoC/rekognition/input.jpg'
    }
  }
};

setInterval(() => {
  reokgnition.searchFacesByImage(params).promise().then(res => {
    console.log(res)
  }).catch(err => {
    console.error(err)
  })
}, 5 * 1000);




