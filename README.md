[![monitode logo](https://raw.githubusercontent.com/hex7c0/monitode/master/public/monitode.png)](https://hex7c0.github.io/monitode/)

**Monitode** is a resource monitor for [nodejs](http://nodejs.org) 
using a full stack of [MEAN](http://en.wikipedia.org/wiki/MEAN)

[![Build Status](https://travis-ci.org/hex7c0/monitode.svg?branch=master)](https://travis-ci.org/hex7c0/monitode) [![NPM version](https://badge.fury.io/js/monitode.svg)](http://badge.fury.io/js/monitode)

## Installation

Install through NPM

```
npm install monitode
```
or
```
git clone git://github.com/hex7c0/monitode.git
```

## API

inside nodejs project
```js
var monitode = require('monitode');

monitode({
    password : 'psw',
});
```

inside expressjs project
```js
var monitode = require('monitode');
var app = require('express')();

app.use(monitode({
    password : 'psw'
}));
```

inside expressjs project with [logger-request](https://github.com/hex7c0/logger-request)
```js
var monitode = require('monitode');
var app = require('express')();
var logger = require('logger-request');

var file = __dirname + '/monitode.log'
app.use(logger({
    filename : file,
}));
app.use(monitor({
    log : file,
}));
```

### monitode(options)

#### options

 - `output` - **Boolean** If enabled, show output to shell console *(default 'false')*
 
 - `os` - **Boolean** If enabled, show os statistics to web console/database/email *(default 'false')* **_MAC ONLY FOR NOW_**
 
 - `http` - **Object** Setting up a web console
  - `enabled` - **Boolean** If disabled, don't run web support *(default 'enabled')*
  - `port` - **Integer** Which port accept connection of web console *(default '30000')*
  - `user` - **String** User for web authentication *(default 'admin')*
  - `password` - **String** Password for web authentication *(default 'password')*
  - `agent` - **String** Browser User Agent for web authentication *(default 'all accepted')*
 
 - `logger` - **Object** Setting up a permanent file which save your story
  - `log` - **String** Path to log file, using [logger-request](https://github.com/hex7c0/logger-request) *(default 'disabled')* Parsing information stored inside log, and show it to web console or file/database
  - `file` - **String** Path to file *(default 'disabled')* Save stats at regular intervals to file
  - `timeout` - **Integer** Timeout (second) for file write *(default '5')*
 
 - `db` - **Object** Setting up a connectiont to database which save your story
  - `mongo` - **String** URI for MongoDB connection *(default 'disabled')* Save stats at regular intervals to database
  - `timeout` - **Integer** Timeout (second) for database query *(default '20')*
 
 - `mail` - **Object** Setting up SMTP
  - `provider` - **String** Check this [link](https://github.com/andris9/nodemailer#well-known-services-for-smtp) for available email provider *(default 'disabled')*
  - `user` - **String** User for email authentication *(default 'admin')*
  - `password` - **String** Password for email authentication *(default 'password')*
  - `to` - **Array** Write here your destination emails *(default 'empty')*
  - `subject` - **String** Email subject *(default 'password')*
  - `timeout` - **Integer** Timeout (second) for email send *(default '60')*
 
 - `status` - **Object** Setting up a check of status of any number of websites and save status to file
  - `enabled` - **Boolean** If disabled, don't run check status *(default 'disabled')*
  - `sites` - **Array** Write here your list of checking websites *(default 'empty')*
  - `port` - **Array** Write here your list of websites port *(default 'empty')*
  - `method` - **String** A string specifying the HTTP request method *(default 'GET')*
  - `agent` - **String** User Agent for sending request *(default 'monitode crawl')*
  - `file` - **String** Where save information of connection *(default 'status')*
  - `timeout` - **Integer** Timeout (second) for email send *(default '120')*

#### Examples

Take a look at my [examples](https://github.com/hex7c0/monitode/tree/master/examples)

Or look at working [pdf output](https://github.com/hex7c0/monitode/raw/master/examples/monitode.pdf)

## License
Copyright (c) 2014 hex7c0

Licensed under the GPLv3 license.
