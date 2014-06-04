"use strict";
/**
 * @file monitode status
 * @module monitode
 * @package monitode
 * @subpackage module
 * @version 2.2.2
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
    var HTTP = require('http');
    /**
     * @global
     */
    var HTTPS = require('https');
    /**
     * @global
     */
    var URL = require('url');
    /**
     * @global
     */
    var LOGGER = require('logger-request');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
/**
 * @global
 */
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

    var options = GLOBAL._m_options.status;
    var status = Math.floor(res.statusCode / 100);
    if (status >= 4) {
        console.log(new Date().toUTCString() + ' ' + res.connection._host + ' ' + res.statusCode);
    }
    var write = {
        host: res.connection._host,
        status: res.statusCode,
        message: res.statusMessage,
        headers: res.headers,
    };
    options.file('moniStatus',write);
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
    var options = GLOBAL._m_options.status;
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
module.exports = function main() {

    var options = GLOBAL._m_options;
    options.status.file = LOGGER({
        logger: '_m_status',
        level: 'debug',
        filename: options.status.file,
        maxsize: null,
        json: false,
        standalone: true,
    });
    if (options.output) {
        console.log('starting monitor with status');
    }
    timeout = setTimeout(request,0);
    return;
}
