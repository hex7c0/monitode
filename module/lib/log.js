"use strict";
/**
 * logger parse function
 * 
 * @file monitode parse logger
 * @module monitode
 * @subpackage lib
 * @version 2.1.2
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/**
 * initialize module
 */
// import
try {
    // global
    /**
     * @global
     */
    var FS = require('fs');
    /**
     * @global
     */
    var READLINE = require('readline');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
/**
 * @global
 */
var log = GLOBAL._m_log;

/**
 * async read of log file
 * 
 * @function logger
 * @param {string} logfile - path of log
 * @return
 */
function logger(logfile) {

    var event = GLOBAL._m_event = {};
    var size = FS.statSync(logfile).size;
    var input = FS.createReadStream(logfile,{
        flags: 'r',
        mode: 444,
        encoding: 'utf-8',
        start: log.size,
        fd: null,
    });
    var stream = READLINE.createInterface({
        input: input,
        output: null,
        terminal: false,
    });

    if (log.size < size) {
        log.size = size;

        /**
         * read one line for once
         * 
         * @param {string} line - line from log file
         * @return
         */
        stream.on('line',function(lines) {

            log.counter++;
            var line = {};
            try {
                line = JSON.parse(lines);
            } catch (e) {
                // pass
            }
            try {
                event[line.url][line.method][line.status].counter++;
            } catch (TypeError) {
                if (event[line.url] == undefined) {
                    event[line.url] = {};
                }
                if (event[line.url][line.method] == undefined) {
                    event[line.url][line.method] = {};
                }
                if (event[line.url][line.method][line.status] == undefined) {
                    event[line.url][line.method][line.status] = {
                        counter: 1,
                    };
                }
            }
            return;
        });
    }
    return;
}
function starter(logfile) {
    /**
     * log starter
     * 
     * @param string logfile: path of log
     * @return void
     */

    FS.exists(logfile,function(exists) {
        /**
         * logger
         * 
         * @param boolean exists: if path exists
         * @return void
         */

        if (exists) {
            logger(logfile);
        }
        return;
    });
    return;
}

/**
 * exports function
 */
module.exports = starter;
