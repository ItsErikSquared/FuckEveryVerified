const client = require('./client')
const fs = require('fs')

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
  console.log('Total Fucked: ' + fs.readFileSync(fuckedFile).toString().split('\n').length)
}

function get() {
  if (!fs.existsSync(fuckedFile)) {
    fs.writeFileSync(fuckedFile, '')
  }

  var gotten = fs.readFileSync(getFile).toString().split('\n')
  var fucked = fs.readFileSync(fuckedFile).toString().split('\n')
  var names = gotten.filter(name => !fucked.includes(name))

  return names[Math.floor(Math.random() * names.length)]
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

  last_post = Date.now()
  lstimer()
}

lstimer()
process.stdout.write(msg)
setInterval(() => {
  var timer = Math.floor(((last_post + (post_every * 1000)) - Date.now()) / 1000)
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