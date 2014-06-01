"use strict";
/**
 * @file monitode file
 * @module monitode
 * @package monitode
 * @subpackage module
 * @version 2.2.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    /**
     * @global
     */
    var LOGGER = require('logger-request');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
/**
 * @global
 */
var timeout = null;

/*
 * functions
 */
/**
 * file loop
 * 
 * @function file
 * @return
 */
function file() {

    clearTimeout(timeout);
    var options = GLOBAL._m_options.logger;
    options.file('moniFile',require('../lib/obj.js').dynamics(true));
    timeout = setTimeout(file,options.timeout);
    return;
}
/**
 * init for file module. Using global var for sharing info
 * 
 * @exports main
 * @function main
 * @return
 */
module.exports = function main() {

    var options = GLOBAL._m_options;
    if (options.output) {
        console.log('starting monitor on file ' + options.logger.file);
    }
    options.logger.file = LOGGER({
        logger: '_m_file',
        level: 'debug',
        filename: options.logger.file,
        maxsize: null,
        json: false,
        standalone: true,
    });
    timeout = setTimeout(file,0);
    return;
}
