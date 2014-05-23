"use strict";
/**
 * file module
 * 
 * @package monitode
 * @subpackage module
 * @version 2.0.0
 * @author hex7c0 <0x7c0@teboss.tk>
 * @license GPLv3
 * @copyright hex7c0 2014
 */

/**
 * initialize module
 * 
 * @global
 */
// import
try{
    // global
    var OS = require('os');
    // personal
    var LOGGER = require('logger-request');
} catch (MODULE_NOT_FOUND){
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}
var timeout = null;

/**
 * functions
 */
function file(){
    /**
     * file loop
     * 
     * @return void
     */

    clearTimeout(timeout);
    var options = GLOBAL._m_options.logger;

    var load = OS.loadavg();
    var free = OS.freemem();
    var v8 = process.memoryUsage();
    var write = {
        cpu: {
            one: load[0],
            five: load[1],
            fifteen: load[2],
        },
        mem: {
            total: OS.totalmem(),
            used: OS.totalmem() - free,
            v8: {
                v8rss: v8.rss,
                v8total: v8.heapTotal,
                v8used: v8.heapUsed,
            },
        },
    };
    options.file('File',write);

    timeout = setTimeout(file,options.timeout);
    return;
}

/**
 * exports function
 */
module.exports = function(){
    /**
     * init for file module. Using global var for sharing info
     * 
     * @return void
     */

    var options = GLOBAL._m_options;

    if (options.output){
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
};
