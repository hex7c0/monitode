"use strict";
/**
 * @file monitode web
 * @module monitode
 * @package monitode
 * @subpackage module
 * @version 2.2.9
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var HTTP = require('http'), EXPRESS = require('express');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
var app = EXPRESS(), log = null, net = null, io = null, end = without_log;

/*
 * functions
 */
/**
 * sending object with log
 * 
 * @function with_log
 * @param {Object} res - response
 * @param {Object} json - builded object
 * @return
 */
function with_log(res,json) {

    /**
     * @global
     */
    var diff = process.hrtime(json.ns);
    var global = GLOBAL.monitode;
    json.log = global.log;
    json.event = global.event;
    json.ns = diff[0] * 1e9 + diff[1];
    res.json(json);
    res.end();
    log(global.logger.log);
    return;
}
/**
 * sending object without log
 * 
 * @function with_log
 * @param {Object} res - response
 * @param {Object} json - builded object
 * @return
 */
function without_log(res,json) {

    var diff = process.hrtime(json.ns);
    json.ns = diff[0] * 1e9 + diff[1];
    res.json(json);
    res.end();
    return;
}
/**
 * init for web module. Using global var for sharing info
 * 
 * @exports main
 * @function main
 * @return
 */
module.exports = function() {

    /**
     * @global
     */
    var options = GLOBAL.monitode;
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
    app.disable('x-powered-by');
    app.disable('etag');
    app.use(require('basic-authentication')({
        user: options.http.user,
        password: options.http.password,
        agent: options.http.agent,
        realm: options.http.realm,
        suppress: true,
    }));
    app.use(EXPRESS.static(options.http.dir));
    if (options.output) {
        console.log('starting monitor on port ' + options.http.port);
    }
    HTTP.createServer(app).listen(options.http.port);
    GLOBAL.monitode.http = {
        dir: options.http.dir,
    };
    return;
};

/*
 * express routing
 */
/**
 * GET routing. Send html file
 * 
 * @param {Object} req - client request
 * @param {Object} res - response to client
 * @return
 */
app.get('/',function(req,res) {

    res.sendfile(GLOBAL.monitode.http.dir + 'index.html');
    return;
});
/**
 * POST routing. Build dynamic info
 * 
 * @param {Object} req - client request
 * @param {Object} res - response to client
 * @return
 */
app.post('/dyn/',function(req,res) {

    var json = require('../lib/obj.js').dynamics();
    if (net) {
        /**
         * @global
         */
        var global = GLOBAL.monitode;
        json.net = global.net;
        json.io = global.io;
        end(res,json);
        if (io) {
            net();
            io();
        }
    } else {
        end(res,json);
    }
    return;
});
/**
 * POST routing. Build static info
 * 
 * @param {Object} req - client request
 * @param {Object} res - response to client
 * @return
 */
app.post('/sta/',function(req,res) {

    res.json(require('../lib/obj.js').statics);
    return;
});
