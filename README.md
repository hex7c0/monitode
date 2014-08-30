# [monitode](http://supergiovane.tk/#/monitode)

[![NPM version](https://badge.fury.io/js/monitode.svg)](http://badge.fury.io/js/monitode)
[![Build Status](https://travis-ci.org/hex7c0/monitode.svg?branch=master)](https://travis-ci.org/hex7c0/monitode)
[![Dependency Status](https://david-dm.org/hex7c0/monitode/status.svg)](https://david-dm.org/hex7c0/monitode)

[![monitode logo](https://raw.githubusercontent.com/hex7c0/monitode/master/public/img/logo.png)](https://hex7c0.github.io/monitode/)

Resource monitor for [nodejs](http://nodejs.org) using a full stack of [MEAN](http://en.wikipedia.org/wiki/MEAN).

## Installation

Install through NPM

```bash
npm install monitode
```
or
```bash
git clone git://github.com/hex7c0/monitode.git
```

## API

inside nodejs project
```js
var monitode = require('monitode')();
```

inside expressjs project
```js
var monitode = require('monitode');
var app = require('express')();

app.use(monitode({
    password : 'psw'
}));
```

inside expressjs project with [`logger-request`](https://github.com/hex7c0/logger-request)
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

Monidote informations are stored inside _GLOBAL_ **Object**.
One istance for environment.
```js
GLOBAL.monitode;
```

### monitode(options)

#### options

 - `output` - **Boolean** If enabled, show output to shell console *(default "false")*
 - `os` - **Boolean** If enabled, show os (netstat, iostat) statistics to web console/database/email *(default "false")* **_NOT FOR WIN_**
 - `tickle` - **Boolean** If enabled, using [`tickle`](https://github.com/hex7c0/tickle) inside dynamic datas *(default "disabled")*
 - `app` - **Object** If enabled, using Express object for [`express-sitemap`](https://github.com/hex7c0/express-sitemap) inside static datas *(default "disabled")*
 
 
 
 - `http` - **Object** Setting up a web console using [`basic-authentication`](https://github.com/hex7c0/basic-authentication)
  - `enabled` - **Boolean** If disabled, don't run web console *(default "enabled")*
  - `port` - **Integer** Which port accept connection of web console *(default "30000")*
  - `user` - **String** User for web basic access authentication *(default "admin")*
  - `password` - **String** Password for web basic access authentication *(default "password")*
  - `agent` - **String** Browser User Agent for web authentication *(default "all accepted")*
  - `realm` - **String** Realm for web authentication *(default "Monitode")*
  - `file` - **String** Path of htpasswd file *(default "disabled")*
  - `hash` - **String** Type of [hash](http://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm) inside your htpasswd file *(default "md5")*
  - `dir` - **String** Absolute path of web files directory *(default "/public")*
 
  related to https://github.com/hex7c0/basic-authentication
 
 - `https` - **Object** Setting up a web console over TLS/SSL using [`basic-authentication`](https://github.com/hex7c0/basic-authentication)
  - `key` - **String** Path to TLS/SSL key *(default "disabled")*
  - `cert` - **String** Path to TLS/SSL certificate *(default "disabled")*
  - `port` - **Integer** Which port accept connection of web console over TLS/SSL *(default "30003")*
  - `user` - **String** User for web basic access authentication over TLS/SSL *(default "admin")*
  - `password` - **String** Password for web basic access authentication over TLS/SSL *(default "password")*
  - `agent` - **String** Browser User Agent for web authentication over TLS/SSL *(default "all accepted")*
  - `realm` - **String** Realm for web authentication over TLS/SSL *(default "Monitode")*
  - `file` - **String** Path of htpasswd file *(default "disabled")*
  - `hash` - **String** Type of [hash](http://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm) inside your htpasswd file *(default "md5")*
  - `dir` - **String** Absolute path of web files directory *(default "/public")*
 
  related to https://github.com/hex7c0/basic-authentication
 
 - `logger` - **Object** Setting up a permanent file which save your story
  - `log` - **String** Path to log file, using [`logger-request`](https://github.com/hex7c0/logger-request) *(default "disabled")* Parsing information stored inside log, and show it to web console or file/database
  - `file` - **String** Path to file *(default "disabled")* Save stats at regular intervals to file
  - `timeout` - **Float** Timeout (second) for file write *(default "5")*
 
  related to https://github.com/hex7c0/logger-request
 
 - `db` - **Object** Setting up a connectiont to database which save your story
  - `mongo` - **String** URI for MongoDb connection *(default "disabled")* Save stats at regular intervals to database
  - `couch` - **String** URI for CouchDb connection *(default "disabled")* Save stats at regular intervals to database
  - `database` - **String** Name of your database *(default "monitode")*
  - `timeout` - **Float** Timeout (second) for database query *(default "20")*
 
  related to https://github.com/mongodb/node-mongodb-native and https://github.com/dscape/nano
 
 - `mail` - **Object** Setting up SMTP
  - `provider` - **String** Check [`nodemailer`](https://github.com/andris9/nodemailer#well-known-services-for-smtp) for available email provider *(default "disabled")*
  - `user` - **String** User for email authentication *(default "admin")*
  - `password` - **String** Password for email authentication *(default "password")*
  - `to` - **Array** Write here your destination emails *(default "empty")*
  - `subject` - **String** Email subject *(default "password")*
  - `timeout` - **Float** Timeout (second) for email send *(default "60")*
 
 
 
 - `status` - **Object** Setting up a check of status of any number of websites and save status to file
  - `enabled` - **Boolean** If disabled, don't run check status *(default "disabled")*
  - `sites` - **Array** Write here your list of checking websites *(default "empty")*
  - `port` - **Array** Write here your list of websites port *(default "empty")*
  - `method` - **String** A string specifying the HTTP request method *(default "GET")*
  - `agent` - **String** User Agent for sending request *(default "monitode crawl")*
  - `file` - **String** Where save information of connection *(default "status")*
  - `timeout` - **Float** Timeout (second) for email send *(default "120")*

## Examples

Take a look at my [examples](https://github.com/hex7c0/monitode/tree/master/examples)

Or look at [pdf](https://github.com/hex7c0/monitode/raw/master/examples/monitode.pdf) file

### [License GPLv3](http://opensource.org/licenses/GPL-3.0)
