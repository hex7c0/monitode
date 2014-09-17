"use strict";
/**
 * @file monitode file
 * @module monitode
 * @package monitode
 * @subpackage module
 * @version 2.5.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var LOGGER = require('logger-request');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/**
 * init for file module. Using global var for sharing info
 * 
 * @exports file
 * @function file
 */
module.exports = function file() {

    /**
     * @global
     */
    var options = GLOBAL.monitode;
    var f = options.logger;
    var timeout;

    /*
     * functions
     */
    /**
     * file loop
     * 
     * @function write
     */
    function write() {

        clearTimeout(timeout);
        /**
         * @global
         */
        f.file('moniFile',require(options.min + 'lib/obj.js').dynamics(true));
        timeout = setTimeout(write,f.timeout);
        return;
    }

    if (options.output) {
        console.log('starting monitor on file ' + f.file);
    }
    f.file = LOGGER({
        standalone: true,
        filename: f.file,
        winston: {
            logger: 'moniFile',
            level: 'debug',
            maxsize: null,
            json: false,
        },
    });
    return write();
};
