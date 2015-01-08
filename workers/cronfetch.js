var archive = require('../helpers/archive-helpers');
var fetch = require('../workers/htmlfetcher.js');
archive.downloadUrls();
console.log('does this log???')


/*
This is the crontab command
* * * * * /Users/HR10/.nvm/v0.10.25/bin/node /Users/HR10/jacky/2014-12-web-historian/workers/cronfetch.js -update -config=myconfig

*/
