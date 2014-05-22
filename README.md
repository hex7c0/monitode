[![monitode logo](https://raw.githubusercontent.com/hex7c0/monitode/master/public/monitode.png)](https://hex7c0.github.io/monitode/)

resource monitor for [nodejs](http://nodejs.org) using a full stack of [MEAN](http://en.wikipedia.org/wiki/MEAN)

[![Build Status](https://travis-ci.org/hex7c0/monitode.svg?branch=master)](https://travis-ci.org/hex7c0/monitode) [![NPM version](https://badge.fury.io/js/monitode.svg)](http://badge.fury.io/js/monitode)

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
var app = require('express')();
var monitode = require('monitode');

app.use(monitode({
    password : 'psw'
}));
```

inside expressjs project with [logger-request](https://github.com/hex7c0/logger-request)
```js
var app = require('express')();
var monitode = require('monitode');
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

#### Options

 - `output` - **Boolean** If enabled, show output to shell console *(default 'false')*
 - `web` - **Boolean** If disabled, don't run web support *(default 'true')*
 - `port` - **Integer** Which port accept connection of web console *(default '30000')*
 - `user` - **String** User for web authentication *(default 'admin')*
 - `password` - **String** Password for web authentication *(default 'password')*
 - `agent` - **String** Browser User Agent for web authentication *(default 'all accepted')*
 - `log` - **String** Path to log file, using [logger-request](https://github.com/hex7c0/logger-request) *(default 'disabled')* Parsing information stored inside log, and show it to web console or files/db
 - `file` - **String** Path to file *(default 'disabled')* Save stats at regular intervals to file
 - `mongo` - **String** URI for MongoDB connection *(default 'disabled')* Save stats at regular intervals to database
 - `timeout` - **Integer** Time (second) for database refresh *(default '5')*

#### Examples

Take a look at my [examples](https://github.com/hex7c0/monitode/tree/master/examples)

## License
Copyright (c) 2014 hex7c0

Licensed under the GPLv3 license.
