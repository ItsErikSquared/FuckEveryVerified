const client = require('./client')
const fs = require('fs')
const { timeLog } = require('console')

//Get File (gen by get.js)
const getFile = './get'
//Fucked File (already posted)
const fuckedFile = './fucked'
//Timer File (stores the last_post)
const timerFile = './timer'

//Msg displaying eta
const msg = 'Time till next status: '
//Post how often? In seconds (900 = 15 minutes)
const post_every = 900

//Last time the post() funct. was called
var last_post = null

var timeDisplaySafe = false

exports = module.exports = {
  timeDisplaySafe(tds = true) {
    timeDisplaySafe = tds
  }
}

//Load save last_post var
function lstimer() {
  if (last_post == null) {
    if (!fs.existsSync(timerFile)) {
      last_post = Date.now()
    } else {
      last_post = Number.parseInt(fs.readFileSync(timerFile).toString())
    }
  }
  fs.writeFileSync(timerFile, last_post.toString())
}

function add(name) {
  fs.appendFileSync(fuckedFile, name)
  console.log('New Name Added: ' + name)
  console.log('Total Fucked: ' + fs.readFileSync(fuckedFile).toString().split('\n').size())
}

function get() {
  if (!fs.existsSync(fuckedFile)) {
    fs.writeFileSync(fuckedFile, '')
  }

  var gotten = fs.readFileSync(getFile).toString().split('\n')
  console.log('gotten ' + gotten.length)
  var fucked = fs.readFileSync(fuckedFile).toString().split('\n')
  console.log('fucked ' + fucked.length)
  var names = gotten.filter(name => !fucked.includes(name))
  console.log('names ' + names.length)

  console.log(names[Math.floor(Math.random() * names.length)])
  return 'ItsErikSquared'
}

function post(name) {
  if (name !== null) {
    client.post('statuses/update', { status: `fuck @${name}` }, (error, tweet, response) => {
      if (error) throw error

      console.log(response)
      console.log(`New Name Fucked: ${name}`)
      add(name)
    })
  } else {
    console.log('Name not found! Trying again in ' + post_every + 'seconds...')
  }

  last_post = Date.now() + (post_every * 1000)
  lstimer()
}

lstimer()
process.stdout.write(msg)
setInterval(() => {
  var timer = Math.floor(((last_post - Date.now()) + (post_every * 1000)) / 1000)
  if (timer < 1) {
    post(get())
  } else {
    if (!timeDisplaySafe) {
      process.stdout.cursorTo(msg.length)
      process.stdout.write((timer < 10 ? "0" : "") + timer)
    } else {
      console.log(msg + timer)
    }
  }
}, 1000)