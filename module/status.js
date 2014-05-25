"use strict";
/**
 * status module
 * 
 * @package monitode
 * @subpackage module
 * @version 2.1.0
 * @author hex7c0 <0x7c0@teboss.tk>
 * @license GPLv3
 * @copyright hex7c0 2014
 */

/**
 * initialize module
 * 
 * @global
 */
// import
try{
    // global
    var HTTP = require('http');
    var HTTPS = require('https');
    var URL = require('url');
    // personal
    var LOGGER = require('logger-request');
} catch (MODULE_NOT_FOUND){
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
var timeout = null;

/**
 * functions
 */
function complete(res){
    /**
     * callback function for request
     * 
     * @param object res: response for website
     * @return void
     */

    var options = GLOBAL._m_options.status;
    var status = Math.floor(res.statusCode / 100);
    if (status >= 4){
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
function request(){
    /**
     * request loop
     * 
     * @return void
     */

    clearTimeout(timeout);
    var options = GLOBAL._m_options.status;
    for (var i = 0, il = options.site.length; i < il; i++){
        var url = URL.parse(options.site[i]);
        var module = HTTP;
        try{
            if (url.protocol.substr(0,5) == 'https'){
                module = HTTPS;
            }
        } catch (TypeError){
            // pass
        }
        var req = null;
        if (url.hostname){
            req = module.request({
                port: options.port[i],
                hostname: url.hostname,
                headers: {
                    'User-Agent': options.agent,
                },
                method: options.method,
                agent: false,
            },complete);
        } else{
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
        req.on('error',function(error){
            console.log(error);
        });
        req.end();
    }
    timeout = setTimeout(request,options.timeout);
    return;
}

/**
 * exports function
 */
module.exports = function(){
    /**
     * init for file module. Using global var for sharing info
     * 
     * @return void
     */

    var options = GLOBAL._m_options;
    options.status.file = LOGGER({
        logger: '_m_status',
        level: 'debug',
        filename: options.status.file,
        maxsize: null,
        json: false,
        standalone: true,
    });
    if (options.output){
        console.log('starting monitor with status');
    }
    timeout = setTimeout(request,0);
    return;
};
