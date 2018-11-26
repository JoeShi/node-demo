'use strict';
require('log-timestamp');
const randomSentence = require('random-sentence');

setInterval(() => {
  console.log(randomSentence({min: 5, max: 30}))
}, 2 * 1000);

setInterval(() => {
  const error = new Error('This is an error message');
  console.error(error);
}, 3 * 1000);

