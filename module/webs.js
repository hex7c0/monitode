"use strict";
/**
 * @file monitode web over TLS/SSL
 * @module monitode
 * @package monitode
 * @subpackage module
 * @version 2.2.21
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var HTTPS = require('https'), FS = require('fs'), EXPRESS = require('express');
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
    if (FS.existsSync(options.https.key) && FS.existsSync(options.https.cert)) {
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
            user: options.https.user,
            password: options.https.password,
            agent: options.https.agent,
            realm: options.https.realm,
            file: options.https.file,
            hash: options.https.hash,
            suppress: true,
        }));
        app.use(EXPRESS.static(options.https.dir));
        if (options.output) {
            console.log('starting ssl monitor on port ' + options.https.port);
        }
        HTTPS.createServer({
            key: FS.readFileSync(options.https.key),
            cert: FS.readFileSync(options.https.cert),
        },app).listen(options.https.port);
    }
    GLOBAL.monitode.https = {
        dir: options.https.dir,
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

    res.sendfile(GLOBAL.monitode.https.dir + 'index.html');
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

    res.json(require('../lib/obj.js').statics(GLOBAL.monitode.app));
    return;
});
