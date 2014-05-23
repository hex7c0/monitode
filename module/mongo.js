"use strict";
/**
 * mongo module
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
    var FS = require('fs');
    // personal
    var CLIENT = require('mongodb').MongoClient;
    // load
    var log = require('./lib/log.js');
} catch (MODULE_NOT_FOUND){
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}
var timeout = null;

/**
 * functions
 */
function query(){
    /**
     * query loop
     * 
     * @return void
     */

    var start = process.hrtime();
    clearTimeout(timeout);
    var options = GLOBAL._m_options;

    var load = OS.loadavg();
    var free = OS.freemem();
    var v8 = process.memoryUsage();
    var insert = {
        date: Date.now(),
        uptime: {
            os: OS.uptime(),
            node: process.uptime(),
        },
        cpu: {
            one: load[0],
            five: load[1],
            fifteen: load[2],
        },
        mem: {
            total: OS.totalmem(),
            used: OS.totalmem() - free,
            v8: {
                rss: v8.rss,
                total: v8.heapTotal,
                used: v8.heapUsed,
            },
        },
        event: GLOBAL._m_event,
    };

    var diff = process.hrtime(start);
    insert.ns = diff[0] * 1e9 + diff[1];
    options.db.database.insert(insert,function(error,result){
        if (error){
            console.log(error);
        } else{
            query = setTimeout(query,options.db.timeout);
        }
    });

    if (options.logger.log){
        FS.exists(options.logger.log,function(){
            log();
        });
    }
    return;
}

/**
 * exports function
 */
module.exports = function(){
    /**
     * init for mongo module. Using global var for sharing info
     * 
     * @return void
     */

    var options = GLOBAL._m_options;

    CLIENT.connect(options.db.mongo,function(error,database){
        if (error){
            console.log(error);
        } else{
            database.createCollection('monitode',function(error,collection){
                if (error){
                    console.log(error);
                } else{
                    options.db.database = collection;
                    if (options.output){
                        console.log('starting monitor on database');
                    }
                    timeout = setTimeout(query,0);
                }
            });
        }
    });

    return;
};
