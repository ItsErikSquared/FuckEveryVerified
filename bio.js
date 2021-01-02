const client = require('./client.js')
const fs = require('fs')

const getFile = './get'
const fuckedFile = './fucked'

function updateBio() {
  var get = fs.readFileSync(getFile).toString().split('\n').length - 1
  var fucked = fs.readFileSync(fuckedFile).toString().split('\n').length - 1

  client.get('users/show.json', { screen_name: 'verified' }, (error, tweet, response) => {
    if (error) {
      console.log('Could not update bio.')
      console.error(error)
    }
    var following = JSON.parse(response.body).friends_count
    var fpercent = ((fucked / following) * 100).toFixed(1)
    var gpercent = ((get / following) * 100).toFixed(1)

    client.post('account/update_profile', {
      description: `Fuck every @verified by @ItsErikSquared\nNow w/ people who should be verified!\n\nThis is all fun and games I swear :) (mostly)\nFucked: ${fucked} (${fpercent}%)`
    }, (error, tweet, response) => {
      if (error) {
        console.log('Could not update bio.')
        console.error(error)
      }
      console.log('Bio Updated.')
    })
  })
}

updateBio()

module.exports = exports = {
  updateBio
}