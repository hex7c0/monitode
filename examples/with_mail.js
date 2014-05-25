"use strict";
/**
 * example with mail
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
} catch (MODULE_NOT_FOUND){
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}

// using standalone
monitor({
    mail: {
        provider: 'gmail',
        user: 'pippo@gmail.com',
        password: 'myStrongPsw1',
        to: ['pluto@gmail.com','mickey@gmail.com'],
    }
});
