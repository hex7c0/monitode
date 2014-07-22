"use strict";
/**
 * @file monitode status
 * @module monitode
 * @package monitode
 * @subpackage module
 * @version 2.3.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var HTTP = require('http');
    var HTTPS = require('https');
    var URL = require('url');
    var LOGGER = require('logger-request');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
var timeout = null;

/*
 * functions
 */
/**
 * callback function for request
 * 
 * @function complete
 * @param {Object} res - response for website
 * @return
 */
function complete(res) {

    /**
     * @global
     */
    var options = GLOBAL.monitode.status;
    var status = Math.floor(res.statusCode / 100);
    if (status >= 4) {
        console.log(new Date().toUTCString() + ' ' + res.connection._host + ' '
                + res.statusCode);
    }
    options.file('moniStatus',{
        host: res.connection._host,
        status: res.statusCode,
        message: res.statusMessage,
        headers: res.headers,
    });
    return;
}

/**
 * request loop
 * 
 * @function request
 * @return
 */
function request() {

    clearTimeout(timeout);
    /**
     * @global
     */
    var options = GLOBAL.monitode.status;
    for (var i = 0, il = options.site.length; i < il; i++) {
        var url = URL.parse(options.site[i]);
        var module = HTTP;
        try {
            if (url.protocol.substr(0,5) == 'https') {
                module = HTTPS;
            }
        } catch (TypeError) {
            // pass
        }
        var req = null;
        if (url.hostname) {
            req = module.request({
                port: options.port[i],
                hostname: url.hostname,
                headers: {
                    'User-Agent': options.agent,
                },
                method: options.method,
                agent: false,
            },complete);
        } else {
            req = module.request({
                port: options.port[i],
                host: options.site[i],
                headers: {
                    'User-Agent': options.agent,
                },
                method: options.method,
                agent: false,
            },complete);
        }
        req.on('error',function(error) {

            console.error(error);
            return;
        });
        req.end();
    }
    timeout = setTimeout(request,options.timeout);
    return;
}

/**
 * init for file module. Using global var for sharing info
 * 
 * @exports main
 * @function main
 * @return
 */
module.exports = function() {

    var options = GLOBAL.monitode;

    options.status.file = LOGGER({
        standalone: true,
        filename: options.status.file,
        winston: {
            logger: 'moniStatus',
            level: 'debug',
            maxsize: null,
            json: false,
        },
    });
    if (options.output) {
        console.log('starting monitor with status');
    }
    request();
    return;
};
