"use strict";
/**
 * @file monitode file
 * @module monitode
 * @subpackage module
 * @version 2.1.2
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    // global
    /**
     * @global
     */
    var OS = require('os');
    // personal
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
    var load = OS.loadavg();
    var total = OS.totalmem();
    var v8 = process.memoryUsage();
    var write = {
        cpu: {
            one: load[0],
            five: load[1],
            fifteen: load[2],
        },
        mem: {
            total: total,
            used: total - OS.freemem(),
            v8: {
                v8rss: v8.rss,
                v8total: v8.heapTotal,
                v8used: v8.heapUsed,
            },
        },
    };
    options.file('moniFile',write);
    timeout = setTimeout(file,options.timeout);
    return;

}
/**
 * init for file module. Using global var for sharing info
 * 
 * @function main
 * @return
 */
function main() {

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

/**
 * exports function
 * 
 * @exports main
 */
module.exports = main;
