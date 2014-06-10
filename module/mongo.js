"use strict";
/**
 * @file monitode mongo
 * @module monitode
 * @package monitode
 * @subpackage module
 * @version 2.2.5
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var CLIENT = require('mongodb').MongoClient;
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
var timeout = null, log = null, net = null, io = null, end = without_log;

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

    /**
     * @global
     */
    var options = GLOBAL._m_options;
    var diff = process.hrtime(json.ns);
    json.ns = diff[0] * 1e9 + diff[1];
    json.event = GLOBAL._m_event;
    /**
     * callback of query
     * 
     * @function
     * @param {String} error - error output
     * @param {Object} result - result of query
     * @return
     */
    options.db.database.insert(json,function(error,result) {

        if (error) {
            console.error(error);
        } else {
            timeout = setTimeout(query,options.db.timeout);
        }
        return;
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

    /**
     * @global
     */
    var options = GLOBAL._m_options.db;
    var diff = process.hrtime(json.ns);
    json.ns = diff[0] * 1e9 + diff[1];
    /**
     * callback of query
     * 
     * @function
     * @param {String} error - error output
     * @param {Object} result - result of query
     * @return
     */
    options.database.insert(json,function(error,result) {

        if (error) {
            console.error(error);
        } else {
            timeout = setTimeout(query,options.timeout);
        }
        return;
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
    var json = require('../lib/obj.js').dynamics();
    if (net) {
        json.net = GLOBAL._m_net;
        json.io = GLOBAL._m_io;
        end(json);
        if (io) {
            net();
            io();
        }
    } else {
        end(json);
    }
    return;
}
/**
 * init for mongo module. Using global var for sharing info
 * 
 * @exports main
 * @function main
 * @return
 */
var main = module.exports = function() {

    /**
     * @global
     */
    var options = GLOBAL._m_options;
    if (options.os) {
        if (options.monitor.os) {
            options.monitor.os = false;
            net = require('../lib/net.js')();
            io = require('../lib/io.js')();
        } else {
            net = true;
        }
    }
    if (options.logger.log) {
        end = with_log;
        if (options.monitor.log) {
            options.monitor.log = false;
            log = require('../lib/log.js');
        } else {
            log = function() {

                return;
            };
        }
    }
    CLIENT.connect(options.db.mongo,function(error,database) {

        if (error) {
            console.error(error);
        } else {
            database.createCollection(options.db.database,function(error,collection) {

                if (error) {
                    console.error(error);
                } else {
                    options.db.database = collection;
                    if (options.output) {
                        console.log('starting monitor on database');
                    }
                    query();
                }
                return;
            });
        }
        return;
    });
    return;
};
