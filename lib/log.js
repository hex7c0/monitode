'use strict';
/**
 * @file monitode parse logger
 * @module monitode
 * @package monitode
 * @subpackage lib
 * @version 2.6.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var FS = require('fs'), STARTLINE = require('startline');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * functions
 */
/**
 * async read of log file
 * 
 * @function logger
 * @param {String} logfile - path of log
 */
function logger(logfile) {

    /**
     * @global
     */
    var event = global.monitode.event = Object.create(null);
    /**
     * @global
     */
    var log = global.monitode.log;
    var size = FS.statSync(logfile).size;
    var stream = STARTLINE({
        file: logfile,
        flags: 'r',
        mode: 444,
        encoding: 'utf8',
        start: log.size,
    });

    if (log.size < size) {
        log.size = size;

        /**
         * read one line for once
         * 
         * @function parse
         * @param {String} line - line from log file
         */
        var parse = function(lines) {

            var line = Object.create(null);
            try {
                line = JSON.parse(lines);
            } catch (e) {
                return;
            }
            log.counter++;
            if (event[line.url] && event[line.url][line.method]
                    && event[line.url][line.method][line.status]) {
                event[line.url][line.method][line.status].counter++;
            } else {
                if (event[line.url] === undefined) {
                    event[line.url] = Object.create(null);
                }
                if (event[line.url][line.method] === undefined) {
                    event[line.url][line.method] = Object.create(null);
                }
                if (event[line.url][line.method][line.status] === undefined) {
                    event[line.url][line.method][line.status] = {
                        counter: 1,
                    };
                }
            }
            return;
        };
        stream.on('line', parse);
    }
    return;
}

/**
 * log bootstrap
 * 
 * @exports main
 * @function main
 * @param {String} logfile - path of log
 */
module.exports = function log(logfile) {

    /**
     * logger check
     * 
     * @function
     * @param {Boolean} exists - if path exists
     */
    FS.exists(logfile, function(exists) {

        if (exists) {
            logger(logfile);
        }
        return;
    });
    return;
};
