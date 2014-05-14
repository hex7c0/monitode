browser-language [![Build Status](https://travis-ci.org/hex7c0/browser-language.svg?branch=master)](https://travis-ci.org/hex7c0/browser-language) [![NPM version](https://badge.fury.io/js/browser-language.svg)](http://badge.fury.io/js/browser-language)
==============

grab browser language for [expressjs](http://expressjs.com/)

## API

```js
var app = require('express')();
var cookie = require('cookie-parser');
var browser-language = require('browser-language');

app.use(cookie('pippo'));
app.use(browser-language({_default:'en',en:'en'}));
```

### browser-language(dictionary)

Setup accepted languages with the given `dictionary` (object).

#### Options

  - `_default` - The dafault value, if request from client cannot be evaluated
  - `en` - Set cookie with 'en' value
  - `it` - Set cookie with 'it' value
  - `..` - Set cookie with '..' value

object with correct value to be added, otherwise using a default dictionary inside /lib/dictionary.js

#### Examples

Take a look at my [examples](https://github.com/hex7c0/browser-language/tree/master/examples)

## License
Copyright (c) 2014 hex7c0
Licensed under the GPLv3 license.
