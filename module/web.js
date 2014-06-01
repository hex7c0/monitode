"use strict";
/**
 * @file monitode web
 * @module monitode
 * @package monitode
 * @subpackage module
 * @version 2.2.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    /**
     * @global
     */
    var EXPRESS = require('express');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
/**
 * @global
 */
var app = EXPRESS(), log = null, net = null, io = null, end = without_log;

/*
 * functions
 */
/**
 * protection middleware with basic authentication
 * 
 * @function auth
 * @param {Object} req - client request
 * @param {Object} res - response to client
 * @param {next} next - continue routes
 * @return
 */
function auth(req,res,next) {

    // auth
    var user = false, auth = null;
    if (auth = req.headers.authorization) {
        auth = auth.split(' ');
        if ('basic' == auth[0].toLowerCase() && auth[1]) {
            auth = new Buffer(auth[1],'base64').toString();
            auth = auth.match(/^([^:]+):(.+)$/);
            if (auth) {
                user = {
                    name: auth[1],
                    password: auth[2],
                }
            }
        }
    }
    // check
    var options = GLOBAL._m_options.http;
    if (!user || user.name != options.user || user.password != options.password) {
        res.setHeader('WWW-Authenticate','Basic realm="monitode"');
        res.status(401).end('Unauthorized');
    } else if (options.agent && options.agent == req.headers['user-agent']) {
        next();
    } else if (!options.agent) {
        next();
    } else {
        res.status(403).end('Forbidden');
    }
    return;
}
/**
 * sending object with log
 * 
 * @function with_log
 * @param {Object} res - response
 * @param {Object} json - builded object
 * @return
 */
function with_log(res,json) {

    json.log = GLOBAL._m_log;
    json.event = GLOBAL._m_event;
    var diff = process.hrtime(json.ns);
    json.ns = diff[0] * 1e9 + diff[1];
    res.json(json);
    res.end();

    var options = GLOBAL._m_options.logger.log;
    log(options);
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
module.exports = function main() {

    var options = GLOBAL._m_options;
    if (options.os) {
        net = require('../lib/net.js')();
        io = require('../lib/io.js')();
    }
    if (options.logger.log) {
        log = require('../lib/log.js');
        end = with_log;
    }
    app.disable('x-powered-by');
    app.disable('etag')
    app.use(EXPRESS.static(process.env._m_main + '/public/'));
    if (options.output) {
        console.log('starting monitor on port ' + options.http.port);
    }
    app.listen(options.http.port);
    return;
}

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
app.get('/',auth,function(req,res) {

    res.sendfile(process.env._m_main + '/console/index.html');
    return;
});
/**
 * POST routing. Build dynamic info
 * 
 * @param {Object} req - client request
 * @param {Object} res - response to client
 * @return
 */
app.post('/dyn/',auth,function(req,res) {

    var json = require('../lib/obj.js').dynamics();
    if (net) {
        json.net = GLOBAL._m_net;
        json.io = GLOBAL._m_io;
        end(res,json);
        net();
        io();
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
app.post('/sta/',auth,function(req,res) {

    res.json(require('../lib/obj.js').statics);
    return;
});
