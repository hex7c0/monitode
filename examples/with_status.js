"use strict";
/**
 * @file example with status
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
    var monitode = require('../index.min.js'); // use require('monitode') instead
    var app = require('express')();
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * use
 */
// using standalone
monitode({
    status: {
        enabled: true,
        site: ['127.0.0.1','http://192.168.2.1','https://www.google.com'],
        port: [30000,80,443],
    }
});

// express routing
app.get('/',function(req,res) {

    res.send('hello world!');
});
// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');
