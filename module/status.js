"use strict";
/**
 * @file monitode status
 * @module monitode
 * @package monitode
 * @subpackage module
 * @version 2.4.0
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

/**
 * init for file module. Using global var for sharing info
 * 
 * @exports main
 * @function main
 */
module.exports = function() {

    /**
     * @global
     */
    var options = GLOBAL.monitode;
    var s = options.status;
    var timeout;

    /*
     * functions
     */
    /**
     * callback function for request
     * 
     * @function complete
     * @param {Object} res - response for website
     */
    function complete(res) {

        var status = Math.floor(res.statusCode / 100);
        if (status >= 4) {
            console.log(new Date().toUTCString() + ' ' + res.connection._host
                    + ' ' + res.statusCode);
        }
        s.file('moniStatus',{
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
     */
    function request() {

        clearTimeout(timeout);
        for (var i = 0, ii = s.site.length; i < ii; i++) {
            var url = URL.parse(s.site[i]);
            var module = HTTP;
            try {
                if (url.protocol.substr(0,5) == 'https') {
                    module = HTTPS;
                }
            } catch (TypeError) {
                // pass
            }
            var req;
            if (url.hostname) {
                req = module.request({
                    port: s.port[i],
                    hostname: url.hostname,
                    headers: {
                        'User-Agent': s.agent,
                    },
                    method: s.method,
                    agent: false,
                },complete);
            } else {
                req = module.request({
                    port: s.port[i],
                    host: s.site[i],
                    headers: {
                        'User-Agent': s.agent,
                    },
                    method: s.method,
                    agent: false,
                },complete);
            }
            req.on('error',function(error) {

                console.error(error);
                return;
            });
            req.end();
        }
        timeout = setTimeout(request,s.timeout);
        return;
    }

    s.file = LOGGER({
        standalone: true,
        filename: s.file,
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
    return request();
};
