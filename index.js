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

    var options = options || {};
    options.output = Boolean(options.output);
    // http
    options.http = {};
    options.http.enabled = options.http.enabled == false ? false : true;
    options.http.port = parseInt(options.http.port) || 30000;
    options.http.user = String(options.http.user || 'admin');
    options.http.password = String(options.http.password || 'password');
    options.http.agent = options.http.agent || null;
    // logger
    options.logger = options.logger || {};
    options.logger.log = options.logger.log || null;
    options.logger.file = options.logger.file || null;
    options.logger.timeout = (parseInt(options.logger.timeout) || 5) * 1000;
    // database
    options.db = options.db || {};
    options.db.mongo = options.db.mongo || null;
    options.db.database = null;
    options.db.timeout = (parseInt(options.db.timeout) || 20) * 1000;
    // mail
    options.mail = options.mail || {};
    options.mail.provider = options.mail.provider || null;
    options.mail.user = String(options.mail.user || 'admin');
    options.mail.password = String(options.mail.password || 'password');
    options.mail.to = options.mail.to || [];
    options.mail.subject = String(options.mail.subject || 'monitode report');
    options.mail.timeout = (parseInt(options.mail.timeout) || 60) * 1000;
    // status
    options.status = options.status || {};
    options.status.enabled = Boolean(options.status.enabled);
    options.status.site = options.status.site || [];
    options.status.port = options.status.port || [];
    options.status.method = String(options.status.method || 'GET');
    options.status.agent = String(options.status.agent || 'monitode crawl');
    options.status.file = options.status.file || 'status';
    options.status.timeout = (parseInt(options.status.timeout) || 120) * 1000;

    GLOBAL._m_options = options;
    GLOBAL._m_log = {
        counter: 0,
        size: 0,
    };
    GLOBAL._m_event = {};
    process.env.NODE_ENV = 'production';
    process.env._m_main = __dirname;

    if (options.http.enabled){
        // web runnning
        require('./module/web.js')();
    }
    if (options.logger.file){
        // file runnning
        require('./module/file.js')();
    }
    if (options.db.mongo){
        // mongodb runnning
        require('./module/mongo.js')();
    }
    if (options.mail.provider){
        // mongodb runnning
        require('./module/mail.js')();
    }
    if (options.status.enabled){
        // mongodb runnning
        require('./module/status.js')();
    }
    if (!options.logger.log){
        // remove obsolete
        GLOBAL._m_log = GLOBAL._m_event = null;
    }

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
