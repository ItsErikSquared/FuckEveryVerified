require('dotenv').config()
const Twitter = require('twitter')

var client = new Twitter({
  consumer_key: process.env.CONSUMER,
  consumer_secret: process.env.CSECRET,
  access_token_key: process.env.ACCESS,
  access_token_secret: process.env.ASECRET
});

exports = module.exports = client