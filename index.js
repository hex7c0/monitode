"use strict";
/**
 * monitode
 * 
 * @package monitode
 * @subpackage index
 * @version 1.3.1
 * @author hex7c0 <0x7c0@teboss.tk>
 * @license GPLv3
 * @copyright hex7c0 2014
 */

/**
 * main
 */
function monitode(options){
    /**
     * option setting
     * 
     * @param object options: various options. Check README.md
     * @return function
     */

    // global
    var spinterogeno = [];
    var my = GLOBAL._m_options = {};
    var options = options || {};
    my.output = Boolean(options.output);
    process.env.NODE_ENV = 'production';
    process.env._m_main = __dirname;

    // http
    options.http = options.http || {};
    options.http.enabled = options.http.enabled == false ? false : true;
    if (options.http.enabled){
        my.http = {
            port: parseInt(options.http.port) || 30000,
            user: options.http.user = String(options.http.user || 'admin'),
            password: String(options.http.password || 'password'),
            agent: options.http.agent || null,
        };
        spinterogeno.push(require('./module/web.js'));
    }

    // logger
    options.logger = options.logger || {};
    if (options.logger.file){
        my.logger = {
            file: String(options.logger.file),
            timeout: (parseInt(options.logger.timeout) || 5) * 1000,
        };
        spinterogeno.push(require('./module/file.js'));
    } else{
        my.logger = {};
    }
    if (options.logger.log){
        my.logger.log = String(options.logger.log);
        GLOBAL._m_log = {
            counter: 0,
            size: 0,
        };
        GLOBAL._m_event = {};
    }

    // database
    options.db = options.db || {};
    if (options.db.mongo){
        my.db = {
            database: null,
            mongo: String(options.db.mongo),
            timeout: (parseInt(options.db.timeout) || 20) * 1000,
        };
        spinterogeno.push(require('./module/mongo.js'));
    }

    // mail
    options.mail = options.mail || {};
    if (options.mail.provider){
        my.mail = {
            provider: String(options.mail.provider),
            user: String(options.mail.user || 'admin'),
            password: String(options.mail.password || 'password'),
            to: options.mail.to || [],
            subject: String(options.mail.subject || 'monitode report'),
            timeout: (parseInt(options.mail.timeout) || 60) * 1000,
        };
        spinterogeno.push(require('./module/mail.js'));
    }

    // status
    options.status = options.status || {};
    options.status.enabled = Boolean(options.status.enabled);
    if (options.status.enabled){
        my.status = {
            site: options.status.site || [],
            port: options.status.port || [],
            method: String(options.status.method || 'GET'),
            agent: String(options.status.agent || 'monitode crawl'),
            file: String(options.status.file || 'status'),
            timeout: (parseInt(options.status.timeout) || 120) * 1000,
        };
        spinterogeno.push(require('./module/status.js'));
    }

    // start
    for (var i = 0, il = spinterogeno.length; i < il; i++){
        spinterogeno[i]();
    }
    options = spinterogeno = null;

    return function monitor(req,res,next){
        /**
         * express middleware
         * 
         * @param object req: request
         * @param object res: response
         * @param object next: continue routes
         * @return function
         */

        return next();
    };
}

/**
 * exports function
 */
module.exports = monitode;
if (!module.parent){
    // if standalone testing
    monitode({
        output: true,
    });
}
