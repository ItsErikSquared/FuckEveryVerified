const client = require('./client.js')
const fs = require('fs')

const getFile = './get'
const cursorFile = './cursor'
// Get 200 people (max limit) Every 1 minute (rate limit 15 requests every 15 minutes) (in secs)
const get_every_x = 60
// Coutdown String
const msg = 'Time till next request: '
// How long until next
var timer = get_every_x
// Where we are in the list (due to limit of 200/req) -1 = beginning
var cursor = null

var timeDisplaySafe = false

exports = module.exports = {
  timeDisplaySafe(tds = true) {
    timeDisplaySafe = tds
  }
}

//Load/Save Cursor
//If there is no cursor currently:
//  and the cursor file doesn't exist: cursor = -1
//  and the cursor file does exist: cursor = from file
//THEN save the cursor to file
function lscursor() {
  if (cursor == null) {
    if (!fs.existsSync(cursorFile)) {
      cursor = -1
    } else {
      cursor = Number.parseInt(fs.readFileSync(cursorFile).toString())
    }
  }
  fs.writeFileSync(cursorFile, cursor.toString())
}

function writeIfNotExists(names) {
  if (!fs.existsSync(getFile)) {
    fs.writeFileSync(getFile, '')
  }
  var current_list = fs.readFileSync(getFile).toString()
  names.forEach(name => {
    if (!current_list.includes(name)) {
      fs.appendFileSync(getFile, name + '\n')
      console.log(`New Name Added: ${name}`)
    }
  })
  console.log(`Total Names: ${current_list.split('\n').length + names.length}`)
  process.stdout.write(msg)
}

// Get accounts, write them to a list
function getAccounts() {
  client.get('friends/list.json', { screen_name: 'verified', count: 200, cursor }, (error, tweets, response) => {
    if (error) {
      console.log('Could not get list.')
      console.error(error)
    }
    var body = JSON.parse(response.body)
    // get all the users that were returned, make sure they are verified, then turn the array into just their names, then sent over to writeIfNotExists
    writeIfNotExists(body.users.filter(user => user.verified).map(user => user.screen_name))
    cursor = body.next_cursor
    lscursor()
  })
}

console.log('\nFuck Every @Verified App\n     List Generator\n   By @ItsErikSquared\n\n')

lscursor()
process.stdout.write(msg)
setInterval(() => {
  if (timer < 1) {
    getAccounts()
    timer = get_every_x
  } else {
    timer--
    if (!timeDisplaySafe) {
      process.stdout.cursorTo(msg.length)
      process.stdout.write((timer < 10 ? "0" : "") + timer)
    } else {
      console.log(msg + timer)
    }
  }
}, 1000)