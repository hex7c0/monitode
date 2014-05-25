"use strict";
/**
 * mongo module
 * 
 * @package monitode
 * @subpackage module
 * @version 2.1.0
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
    var CLIENT = require('mongodb').MongoClient;
} catch (MODULE_NOT_FOUND){
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
var timeout = null;
var log = null;
var end = without_log;

/**
 * functions
 */
function with_log(json){
    /**
     * sending object
     * 
     * @param object json: builded object
     * @return void
     */

    var options = GLOBAL._m_options;
    json.event = GLOBAL._m_event;
    options.db.database.insert(json,function(error,result){
        if (error){
            console.log(error);
        } else{
            timeout = setTimeout(query,options.db.timeout);
        }
    });
    log(options.logger.log);
    return;
}
function without_log(json){
    /**
     * sending object
     * 
     * @param object json: builded object
     * @return void
     */

    var options = GLOBAL._m_options.db;
    options.database.insert(json,function(error,result){
        if (error){
            console.log(error);
        } else{
            timeout = setTimeout(query,options.timeout);
        }
    });
    return;
}
function query(){
    /**
     * query loop
     * 
     * @return void
     */

    clearTimeout(timeout);
    var start = process.hrtime();
    var load = OS.loadavg();
    var total = OS.totalmem();
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
            total: total,
            used: total - OS.freemem(),
            v8: {
                rss: v8.rss,
                total: v8.heapTotal,
                used: v8.heapUsed,
            },
        },
    };
    var diff = process.hrtime(start);
    insert.ns = diff[0] * 1e9 + diff[1];
    end(insert);
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
    if (options.logger.log){
        log = require('./lib/log.js');
        end = with_log;
    }
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
