"use strict";
/**
 * logger parse function
 * 
 * @package monitode
 * @subpackage lib
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
    var FS = require('fs');
    var READLINE = require('readline');
} catch (MODULE_NOT_FOUND){
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}

/**
 * functions
 */
function logger(){
    /**
     * async read of log file
     * 
     * @return void
     */

    var options = GLOBAL._m_options.logger;
    var log = GLOBAL._m_log;
    var size = FS.statSync(options.log).size;
    var input = FS.createReadStream(options.log,{
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

    if (log.size < size){
        var event = GLOBAL._m_event = {};
        log.size = size;
        stream.on('line',function(lines){
            /**
             * read one line for once
             * 
             * @param string line: line from log file
             */

            log.counter++;
            var line = JSON.parse(lines);
            // builder
            try{
                event[line.url][line.method][line.status].counter++;
            } catch (TypeError){
                if (event[line.url] == undefined){
                    event[line.url] = {};
                }
                if (event[line.url][line.method] == undefined){
                    event[line.url][line.method] = {};
                }
                if (event[line.url][line.method][line.status] == undefined){
                    event[line.url][line.method][line.status] = {
                        counter: 1,
                    };
                }
            }

            return;
        });
    } else{
        // clear
        GLOBAL._m_event = {};
    }
    return;
}

/**
 * exports function
 */
module.exports = logger;
