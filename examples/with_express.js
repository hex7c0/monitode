"use strict";
/**
 * @file example with express
 * @module monitode
 * @package monitode
 * @subpackage examples
 * @version 0.0.3
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var monitode = require('../index.js'); // use require('monitode') instead
    var tickle = require('tickle');
    var app = require('express')();
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

app.use(tickle);
// express routing
app.get('/',function(req,res) {

    res.send('hello world!');
});
// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');

/*
 * use
 */
// using middleware
app.use(monitode({
    app: app,
}));
