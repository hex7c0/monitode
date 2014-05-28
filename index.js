"use strict";
/**
 * @file monitode main
 * @module monitode
 * @version 2.1.2
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/**
 * express middleware
 * 
 * @function middle
 * @param {Object} req - client request
 * @param {Object} res - response to client
 * @param {next} next - continue routes
 * @return
 */
function middle(req,res,next) {

    return next();

}
/**
 * option setting
 * 
 * @function monitode
 * @param {Object} options - various options. Check README.md
 * @return {function}
 */
function monitode(options) {

    var spinterogeno = [], my = GLOBAL._m_options = {}, options = options || {};
    // global
    my.output = Boolean(options.output);
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    process.env._m_main = __dirname;
    // http
    options.http = options.http || {};
    options.http.enabled = options.http.enabled == false ? false : true;
    if (options.http.enabled) {
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
    if (options.logger.file) {
        my.logger = {
            file: String(options.logger.file),
            timeout: (parseInt(options.logger.timeout) || 5) * 1000,
        };
        spinterogeno.push(require('./module/file.js'));
    } else {
        my.logger = {};
    }
    if (options.logger.log) {
        my.logger.log = String(options.logger.log);
        GLOBAL._m_log = {
            counter: 0,
            size: 0,
        };
        GLOBAL._m_event = {};
    }
    // database
    options.db = options.db || {};
    if (options.db.mongo) {
        my.db = {
            database: null,
            mongo: String(options.db.mongo),
            timeout: (parseInt(options.db.timeout) || 20) * 1000,
        };
        spinterogeno.push(require('./module/mongo.js'));
    }
    // mail
    options.mail = options.mail || {};
    if (options.mail.provider) {
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
    if (options.status.enabled) {
        my.status = {
            site: Array.isArray(options.status.site) || [],
            port: Array.isArray(options.status.port) || [],
            method: String(options.status.method || 'GET'),
            agent: String(options.status.agent || 'monitode crawl'),
            file: String(options.status.file || 'status'),
            timeout: (parseInt(options.status.timeout) || 120) * 1000,
        };
        spinterogeno.push(require('./module/status.js'));
    }
    // start
    for (var i = 0, il = spinterogeno.length; i < il; i++) {
        spinterogeno[i]();
    }
    options = spinterogeno = null;

    return middle;

}

/**
 * exports function
 * 
 * @exports monitode
 */
module.exports = monitode;

if (!module.parent) {
    // if standalone testing
    monitode({
        output: true,
    });
}
