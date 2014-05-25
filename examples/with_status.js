"use strict";
/**
 * example with status
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
    var monitode = require('../index.js'); // use 'monitode' instead
    var app = require('express')();
} catch (MODULE_NOT_FOUND){
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}

// using standalone
monitode({
    status: {
        enabled: true,
        site: ['127.0.0.1','http://192.168.2.1','https://www.google.com'],
        port: [30000,80,443],
    }
});

// express routing
app.get('/',function(req,res){
    res.send('hello world!');
});
// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');
