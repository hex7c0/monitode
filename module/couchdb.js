"use strict";
/**
 * @file monitode couchdb
 * @module monitode
 * @package monitode
 * @subpackage module
 * @version 2.4.15
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var CLIENT = require('nano');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/**
 * init for couch module. Using global var for sharing info
 * 
 * @exports couch
 * @function couch
 */
module.exports = function couch() {

    /**
     * @global
     */
    var options = GLOBAL.monitode;
    var d = options.db;
    var timeout, log, net, io, end = without_log;

    /*
     * functions
     */
    /**
     * sending object with log
     * 
     * @function with_log
     * @param {Object} json - builded object
     */
    function with_log(json) {

        var diff = process.hrtime(json.ns);
        json.ns = diff[0] * 1e9 + diff[1];
        json.event = options.event;
        /**
         * callback of query
         * 
         * @function
         * @param {String} error - error output
         * @param {Object} result - result of query
         */
        d.couch.insert(json,function(error,result) {

            if (error) {
                console.error(error);
            } else {
                timeout = setTimeout(query,d.timeout);
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
     */
    function without_log(json) {

        var diff = process.hrtime(json.ns);
        json.ns = diff[0] * 1e9 + diff[1];
        /**
         * callback of query
         * 
         * @function
         * @param {String} error - error output
         * @param {Object} result - result of query
         */
        d.couch.insert(json,function(error,result) {

            if (error) {
                console.error(error);
            } else {
                timeout = setTimeout(query,d.timeout);
            }
            return;
        });
        return;
    }

    /**
     * query loop
     * 
     * @function file
     */
    function query() {

        clearTimeout(timeout);
        var json = require(options.min + 'lib/obj.js').dynamics();
        if (net) {
            json.net = options.net;
            json.io = options.io;
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

    if (options.os) {
        if (options.monitor.os) {
            options.monitor.os = false;
            net = require(options.min + 'lib/net.js')();
            io = require(options.min + 'lib/io.js')();
        } else {
            net = true;
        }
    }
    if (options.logger.log) {
        end = with_log;
        if (options.monitor.log) {
            options.monitor.log = false;
            log = require(options.min + 'lib/log.js');
        } else {
            log = function() {

                return;
            };
        }
    }

    // starter
    d.couch = CLIENT(d.couch);
    if (options.output) {
        console.log('starting monitor on CouchDb database');
    }
    query();
};
