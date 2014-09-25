"use strict";
/**
 * @file monitode web over TLS/SSL
 * @module monitode
 * @package monitode
 * @subpackage module
 * @version 2.5.0
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
    var status = require('http').STATUS_CODES;
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/**
 * init for web module. Using global var for sharing info
 * 
 * @exports web
 * @function web
 */
module.exports = function web() {

    /**
     * @global
     */
    var options = global.monitode;
    var h = options.https;
    var app = EXPRESS(), log, net, io, end = without_log;

    /*
     * functions
     */
    /**
     * sending object with log
     * 
     * @function with_log
     * @param {Object} res - response
     * @param {Object} json - builded object
     */
    function with_log(res, json) {

        var diff = process.hrtime(json.ns);
        json.log = options.log;
        json.event = options.event;
        json.ns = diff[0] * 1e9 + diff[1];
        res.json(json);
        log(options.logger.log);
        return;
    }

    /**
     * sending object without log
     * 
     * @function with_log
     * @param {Object} res - response
     * @param {Object} json - builded object
     */
    function without_log(res, json) {

        var diff = process.hrtime(json.ns);
        json.ns = diff[0] * 1e9 + diff[1];
        res.json(json);
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
    app.disable('x-powered-by');
    app.disable('etag');
    app.disable('view cache');
    app.enable('case sensitive routing');
    app.enable('strict routing');
    app.use(require('timeout-request')({
        milliseconds: 4000,
        header: true,
    }));
    app.use(require('basic-authentication')({
        user: h.user,
        password: h.password,
        agent: h.agent,
        realm: h.realm,
        file: h.file,
        hash: h.hash,
        suppress: true,
    }));
    var dir = h.dir;
    var html = dir + 'monitode.html';
    app.use(EXPRESS.static(dir));
    if (FS.existsSync(h.key) && FS.existsSync(h.cert)) {
        if (options.output) {
            console.log('starting monitor on port ' + h.port);
        }
        HTTPS.createServer({
            key: FS.readFileSync(h.key),
            cert: FS.readFileSync(h.cert),
        }, app).listen(h.port);
    }
    global.monitode.https = true;

    /*
     * express routing
     */
    /**
     * GET routing. Send html file
     * 
     * @param {Object} req - client request
     * @param {Object} res - response to client
     */
    app.get('/', function(req, res) {

        // https://github.com/strongloop/express/issues/2290
        // res.sendFile(html);
        res.sendFile(html, {
            etag: false
        });
        return;
    });
    /**
     * POST routing. Build dynamic info
     * 
     * @param {Object} req - client request
     * @param {Object} res - response to client
     */
    app.post('/dyn/', function(req, res) {

        var json = require(options.min + 'lib/obj.js').dynamics();
        if (net) {
            /**
             * @global
             */
            json.net = options.net;
            json.io = options.io;
            end(res, json);
            if (io) {
                net();
                io();
            }
        } else {
            end(res, json);
        }
        return;
    });
    /**
     * POST routing. Build static info
     * 
     * @param {Object} req - client request
     * @param {Object} res - response to client
     */
    app.post('/sta/', function(req, res) {

        res.json(require(options.min + 'lib/obj.js').statics(options.app));
        return;
    });
    /**
     * catch all errors returned from page or return 500
     * 
     * @function
     * @param {Object} err - error raised
     * @param {Object} req - client request
     * @param {Object} res - response to client
     * @param {next} next - next callback
     */
    app.use(function(err, req, res, next) {

        var code = 500;
        var out = '';
        switch (err.message.toLowerCase()) {
            case 'not found':
                return next();
            default:
                out = err.message.toLowerCase();
                break;
        }
        res.status(code).json({
            error: out || status[code].toLowerCase()
        });
        return;
    });
    /**
     * catch error 404 or if nobody cannot parse the request
     * 
     * @function
     * @param {Object} req - client request
     * @param {Object} res - response to client
     */
    app.use(function(req, res) {

        var code = 404;
        res.status(code).json({
            error: status[code].toLowerCase()
        });
        return;
    });
};
