"use strict";
/**
 * @file monitode parse logger
 * @module monitode
 * @package monitode
 * @subpackage lib
 * @version 2.2.3
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var FS = require('fs');
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

/*
 * functions
 */
/**
 * async read of log file
 * 
 * @function logger
 * @param {String} logfile - path of log
 * @return
 */
function logger(logfile) {

    /**
     * @global
     */
    var event = GLOBAL._m_event = {};
    var cache = log;
    var size = FS.statSync(logfile).size;
    var input = FS.createReadStream(logfile,{
        flags: 'r',
        mode: 444,
        encoding: 'utf-8',
        start: cache.size,
        fd: null,
    });
    var stream = READLINE.createInterface({
        input: input,
        output: null,
        terminal: false,
    });
    if (cache.size < size) {
        cache.size = size;
        /**
         * read one line for once
         * 
         * @function
         * @param {string} line - line from log file
         * @return
         */
        stream.on('line',function(lines) {

            cache.counter++;
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
    log = cache;
    return;
}
/**
 * log bootstrap
 * 
 * @exports main
 * @function main
 * @param {String} logfile - path of log
 * @return
 */
var main = module.exports = function(logfile) {

    /**
     * logger check
     * 
     * @function
     * @param {Boolean} exists - if path exists
     * @return
     */
    FS.exists(logfile,function(exists) {

        if (exists) {
            logger(logfile);
        }
        return;
    });
};
