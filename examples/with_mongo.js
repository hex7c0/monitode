"use strict";
/**
 * example with mongodb
 * 
 * @package monitode
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <0x7c0@teboss.tk>
 * @license GPLv3
 */

/**
 * initialize module
 */
// import
try {
    var monitor = require('../index.js'); // use 'monitode' instead
} catch (MODULE_NOT_FOUND) {
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}

// using middleware
app.use(monitor({
    mongo : 'uri',
}));
