"use strict";
/**
 * mongo module
 * 
 * @file monitode mongo
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
    var CLIENT = require('mongodb').MongoClient;
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
/**
 * @global
 */
var timeout = null, log = null, end = without_log;

/*
 * functions
 */
/**
 * sending object with log
 * 
 * @function with_log
 * @param {Object} json - builded object
 * @return
 */
function with_log(json) {

    var options = GLOBAL._m_options;
    json.event = GLOBAL._m_event;
    options.db.database.insert(json,function(error,result) {
        if (error) {
            console.log(error);
        } else {
            timeout = setTimeout(query,options.db.timeout);
        }
    });
    log(options.logger.log);
    return;

}
/**
 * sending object without log
 * 
 * @function without_log
 * @param {Object} json - builded object
 * @return
 */
function without_log(json) {

    var options = GLOBAL._m_options.db;
    options.database.insert(json,function(error,result) {
        if (error) {
            console.log(error);
        } else {
            timeout = setTimeout(query,options.timeout);
        }
    });
    return;

}
/**
 * query loop
 * 
 * @function file
 * @return
 */
function query() {

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
 * init for mongo module. Using global var for sharing info
 * 
 * @function main
 * @return
 */
function main() {

    var options = GLOBAL._m_options;
    if (options.logger.log) {
        log = require('./lib/log.js');
        end = with_log;
    }
    CLIENT.connect(options.db.mongo,function(error,database) {
        if (error) {
            console.log(error);
        } else {
            database.createCollection('monitode',function(error,collection) {
                if (error) {
                    console.log(error);
                } else {
                    options.db.database = collection;
                    if (options.output) {
                        console.log('starting monitor on database');
                    }
                    timeout = setTimeout(query,0);
                }
            });
        }
    });
    return;

}

/**
 * exports function
 * 
 * @exports main
 */
module.exports = main;
