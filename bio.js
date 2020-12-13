const client = require('./client.js')
const fs = require('fs')

const getFile = './get'
const fuckedFile = './fucked'

function updateBio() {
  var get = fs.readFileSync(getFile).toString().split('\n').length
  var fucked = fs.readFileSync(fuckedFile).toString().split('\n').length
  client.post('account/update_profile', {
    description: `Fuck every @verified.\nBy @ItsErikSquared.\n\nImagine being verified...\nThis is all fun and games I swear :) (mostly)\nList Size: ${get}\nFucked: ${fucked}`
  }, (error, tweet, response) => {
    if (error) throw error
    console.log('Bio Updated.')
  })
}

updateBio()

module.exports = exports = {
  updateBio
}