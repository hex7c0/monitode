"use strict";
/**
 * @file monitode main
 * @module monitode
 * @package monitode
 * @subpackage main
 * @version 2.3.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * functions
 */
/**
 * option setting
 * 
 * @exports monitode
 * @function monitode
 * @param {Object} options - various options. Check README.md
 * @return {Function}
 */
module.exports = function monitode(options) {

    var spinterogeno = [], options = options || Object.create(null);
    // global
    /**
     * @global
     */
    var my = GLOBAL.monitode = {
        output: Boolean(options.output),
        tickle: Boolean(options.tickle),
        app: false,
        os: Boolean(options.os),
        monitor: {
            os: true,
            log: true
        },
    };
    if (options.app) {
        my.app = {
            _router: {
                stack: options.app._router.stack,
            }
        };
    }
    if (my.os) {
        /**
         * @global
         */
        GLOBAL.monitode.net = {
            inn: {
                pacs: 0,
                errs: 0,
            },
            out: {
                pacs: 0,
                errs: 0,
            },
        };
        /**
         * @global
         */
        GLOBAL.monitode.io = {
            tps: 0,
            mbs: 0,
        };
    }

    // http
    options.http = options.http || Object.create(null);
    if (options.http.enabled == false ? false : true) {
        my.http = {
            port: Number(options.http.port) || 30000,
            user: String(options.http.user || 'admin'),
            password: String(options.http.password || 'password'),
            agent: String(options.http.agent || ''),
            realm: String(options.http.realm || 'Monitode'),
            file: options.http.file,
            hash: options.http.hash,
            dir: String(options.http.dir || __dirname + '/public/'),
        };
        spinterogeno.push(require('./module/web.js'));
    }
    // https
    options.https = options.https || Object.create(null);
    if (options.https.key && options.https.cert) {
        my.https = {
            key: String(options.https.key),
            cert: String(options.https.cert),
            port: Number(options.https.port) || 30003,
            user: String(options.https.user || 'admin'),
            password: String(options.https.password || 'password'),
            agent: String(options.https.agent || ''),
            realm: String(options.https.realm || 'Monitode'),
            file: options.https.file,
            hash: options.https.hash,
            dir: String(options.https.dir || __dirname + '/public/'),
        };
        spinterogeno.push(require('./module/webs.js'));
    }

    // logger
    options.logger = options.logger || Object.create(null);
    my.logger = Object.create(null);
    if (options.logger.file) {
        my.logger = {
            file: String(options.logger.file),
            timeout: (parseFloat(options.logger.timeout) || 5) * 1000,
        };
        spinterogeno.push(require('./module/file.js'));
    }
    if (options.logger.log) {
        my.logger.log = String(options.logger.log);
        /**
         * @global
         */
        GLOBAL.monitode.log = {
            counter: 0,
            size: 0,
        };
        /**
         * @global
         */
        GLOBAL.monitode.event = Object.create(null);
    }

    // database
    options.db = options.db || Object.create(null);
    if (options.db.mongo) {
        my.db = {
            mongo: String(options.db.mongo),
            database: String(options.db.database || 'monitode'),
            timeout: (parseFloat(options.db.timeout) || 20) * 1000,
        };
        spinterogeno.push(require('./module/mongo.js'));
    }

    // mail
    options.mail = options.mail || Object.create(null);
    if (options.mail.provider) {
        my.mail = {
            provider: String(options.mail.provider),
            user: String(options.mail.user || 'admin'),
            password: String(options.mail.password || 'password'),
            to: Array.isArray(options.mail.to) == true ? options.mail.to : [],
            subject: String(options.mail.subject || 'monitode report'),
            timeout: (parseFloat(options.mail.timeout) || 60) * 1000,
        };
        spinterogeno.push(require('./module/mail.js'));
    }

    // status
    options.status = options.status || Object.create(null);
    if (Boolean(options.status.enabled)) {
        my.status = {
            site: Array.isArray(options.status.site) == true ? options.status.site
                    : [],
            port: Array.isArray(options.status.port) == true ? options.status.port
                    : [],
            method: String(options.status.method || 'GET'),
            agent: String(options.status.agent || 'monitode crawl'),
            file: String(options.status.file || 'status'),
            timeout: (parseFloat(options.status.timeout) || 120) * 1000,
        };
        spinterogeno.push(require('./module/status.js'));
    }

    // start
    for (var i = 0, il = spinterogeno.length; i < il; i++) {
        spinterogeno[i]();
    }
    return function(req,res,next) {

        try {
            return next();
        } catch (TypeError) {
            return;
        }
    };
};
