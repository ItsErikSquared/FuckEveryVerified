# Fuck Every Verified
Say fuck you to everyone who is verified on Twitter!

### What is this?
I wanted to learn a little bit about the Twitter API but I got really side tracked and came up with this idea.
Borrowed idea from [@fckeveryword](https://twitter.com/fckeveryword/) on twitter.

### Are you jealous of other people who are verified?
I don't use Twitter enough to care...

## How does this work?
We pull this list from Twitter's following page.

First, we have to make a list of everyone.
This is the `get.js` javascript file (run by typing `node get` in the console).
On Twitter, if you are verified you are most likely followed by Twitter's [@verified](https://twitter.com/verified) account.
We grab a 'page' of names that are followed by [verified](https://twitter.com/verified) in increments of 200, every 60 seconds due to ratelimits of a max of 200 users/request and 15 requests/15 minutes.
Then it stores a 'cursor' which acts like a book marker that tells us what the next request should start from or 'what page we are on'.
The `get.js` file also makes two files;
 - The `get` file - a list of all screen names (aka the handles).
 - The `cursor` file - just incase the program stops, we can start again from the same place.
Once we are at the end of the book, Twitter will tell us the `cursor` is 0, meaning we can start over and scan through again.
The `get.js` file only will store unique handles/names so we don't tell them off more than once.

Next we have to actually say what we want to these verified jerks!
This is the `tweet.js` javascript file (run by typing `node tweet` in the console).
Technically, we can tweet 300 times/3 hours, which translates to 1/100 seconds, but that seems way to fast to me.
In the `tweet.js` file you can adjust this to your choosing by changing the `post_every` variable (this is in seconds).
By default I set it to post once every 15 minutes, or 900 seconds.
The `tweet.js` javascript file will first get the list of names (`get` file) and a list of names already sent (`fucked` file) then compare them, and randomly pick a name that was not 'fucked' yet.
If it can't find one, it will try again in `post_every` seconds.
Then it will send the tweet, and add the name to the `fucked` file.
The `tweet.js` file will also create a `timer` file.
This stores the last time the bot tweeted and allows the program to startup and keep it's count.
If the process was down longer than the `post_every` variable was set, it will post ASAP and then continue as normal.

Both of these files include a countdown and I have set them up to run in two different commands.
If you want to run both at the same time you can use `node index`.
This will change how the messages output but, oh well.