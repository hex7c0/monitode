"use strict";
/**
 * example with express and logger-request
 * 
 * @package monitode
 * @subpackage examples
 * @version 0.0.2
 * @author hex7c0 <0x7c0@teboss.tk>
 * @license GPLv3
 */

/**
 * initialize module
 */
// import
try{
    var monitor = require('../index.js'); // use 'monitode' instead
    var app = require('express')();
    var logger = require('logger-request');
} catch (MODULE_NOT_FOUND){
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}

// using middleware
var file = __dirname + '/example.log';
app.use(logger({
    filename: file,
    timestamp: Date.now,
    json: true,
}));
app.use(monitor({
    http: {
        enabled: true,
    },
    logger: {
        log: file,
    },
}));

// express routing
app.get('/',function(req,res){
    res.send('hello world!');
});
// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');
