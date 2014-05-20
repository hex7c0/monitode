"use strict";
/**
 * monitode
 * 
 * @package monitode
 * @subpackage index
 * @version 1.2.0
 * @author hex7c0 <0x7c0@teboss.tk>
 * @license GPLv3
 * @overview main module
 * @copyright hex7c0 2014
 */

/**
 * initialize module
 */
// import
try {
    // global
    var OS = require('os');
    var FS = require('fs');
    var READLINE = require('readline');
    // personal
    var EXPRESS = require('express');
    var AUTH = require('basic-auth');
    var CLIENT = require('mongodb').MongoClient;
    // load
    process.env.NODE_ENV = 'production';
    var app = EXPRESS();
} catch (MODULE_NOT_FOUND) {
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}

// variables
var timeout = null;
var ns = {
    start : 0,
    diff : 0,
}
var log = {
    counter : 0,
    size : 0,
};
var event = {};

// init
function monitode(options) {
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
    options.http.enabled = options.web == false ? false : true;
    options.http.port = parseInt(options.port) || 30000;
    options.http.user = String(options.user || 'admin');
    options.http.password = String(options.password || 'password');
    options.http.agent = options.agent || null;
    // logger
    options.logger = {};
    options.logger.log = options.log || null;
    // database
    options.db = {};
    options.db.mongo = options.mongo || null;
    options.db.timeout = (parseInt(options.timeout) || 5) * 1000;
    options.db.database = null;

    app.set('options', options);

    if (options.http.enabled) {
        // express runnning
        app.enable('case sensitive routing');
        app.enable('strict routing');
        app.disable('x-powered-by');
        app.use(EXPRESS.static(__dirname + '/public/'));
        app.listen(options.http.port);
        if (options.output) {
            console.log('starting monitor on port ' + options.http.port);
        }
    }
    if (options.db.mongo) {
        // mongodb runnning
        CLIENT.connect(options.db.mongo, function(error, database) {
            if (error) {
                console.log(error);
            } else {
                database.createCollection('monitode',
                        function(error, collection) {
                            if (error) {
                                console.log(error);
                            } else {
                                options.db.database = collection;
                                timeout = setTimeout(query, 0);
                            }
                        });
                if (options.output) {
                    console.log('starting monitor on database');
                }
            }
        });
    }

    return function monitor(req, res, next) {
        /**
         * future implementation
         * 
         * @param object req: request
         * @param object res: response
         * @param object next: continue routes
         * @return function
         */

        return next();
    }
};
function query() {
    /**
     * query loop
     * 
     * @return void
     */

    ns.start = process.hrtime();
    clearTimeout(timeout);
    var options = app.get('options');

    // node info SYNC
    var load = OS.loadavg();
    var free = OS.freemem();
    var v8 = process.memoryUsage();
    var cpus = OS.cpus()
    for ( var i in cpus) { // slim json
        cpus[i].model = '';
    }
    var insert = {
        date : Date.now(),
        uptimeS : OS.uptime(),
        uptimeN : process.uptime(),
        cpu : {
            one : load[0],
            five : load[1],
            fifteen : load[2],
            cpus : cpus,
        },
        mem : {
            total : OS.totalmem(),
            used : OS.totalmem() - free,
            v8 : {
                rss : v8.rss,
                total : v8.heapTotal,
                used : v8.heapUsed,
            },
        },
    };

    ns.diff = process.hrtime(ns.start);
    insert.ns = ns.diff[0] * 1e9 + ns.diff[1];
    options.db.database.insert(insert, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            timeout = setTimeout(query, options.db.timeout);
        }
    });
    return;
}
function middle(req, res, next) {
    /**
     * protection middleware
     * 
     * @param object req: request
     * @param object res: response
     * @param object next: continue routes
     * @return void
     */

    var options = app.get('options');
    var user = AUTH(req);

    if (user === undefined || user['name'] !== options.http.user
            || user['pass'] !== options.http.password) {
        res.setHeader('WWW-Authenticate', 'Basic realm="monitode"');
        res.status(401).end('Unauthorized');
    } else if (options.http.agent
            && options.http.agent === req.headers['user-agent']) {
        next();
    } else if (!options.http.agent) {
        next();
    } else {
        res.status(403).end('Forbidden');
    }
    return;
}

/**
 * express routing
 */
app.get('/', middle, function(req, res) {
    /**
     * GET routing. Send html file
     * 
     * @param object req: request
     * @param object res: response
     * @return void
     */

    res.sendfile(__dirname + '/console/index.html');
    return;
});
app
        .post(
                '/dyn/',
                middle,
                function(req, res) {
                    /**
                     * POST routing. Build dynamic info
                     * 
                     * @param object req: request
                     * @param object res: response
                     * @return void
                     */

                    ns.start = process.hrtime();

                    // node info SYNC
                    var load = OS.loadavg();
                    var free = OS.freemem();
                    var v8 = process.memoryUsage();
                    var cpus = OS.cpus()
                    for ( var i in cpus) { // slim json
                        cpus[i].model = '';
                    }
                    var dynamics = {
                        date : Date.now(),
                        uptimeS : OS.uptime(),
                        uptimeN : process.uptime(),
                        cpu : {
                            one : load[0],
                            five : load[1],
                            fifteen : load[2],
                            cpus : cpus,
                        },
                        mem : {
                            total : OS.totalmem(),
                            used : OS.totalmem() - free,
                            v8 : {
                                rss : v8.rss,
                                total : v8.heapTotal,
                                used : v8.heapUsed,
                            },
                        },
                        log : log,
                        event : event,
                    };

                    ns.diff = process.hrtime(ns.start);
                    dynamics.ns = ns.diff[0] * 1e9 + ns.diff[1];
                    res.json(dynamics);

                    // logger-request reading ASYNC
                    var options = app.get('options');
                    if (options.logger.log && FS.existsSync(options.logger.log)) {
                        var line = '';
                        var size = FS.statSync(options.logger.log).size;
                        var input = FS.createReadStream(options.logger.log, {
                            flags : 'r',
                            mode : 444,
                            encoding : 'utf-8',
                            start : log.size,
                            fd : null,
                        });
                        var stream = READLINE.createInterface({
                            input : input,
                            output : null,
                            terminal : false,
                        });
                        if (log.size < size) {
                            log.size = size;
                            event = {};
                            stream
                                    .on(
                                            'line',
                                            function(line) {
                                                log.counter++;
                                                line = JSON.parse(line);
                                                // builder
                                                try {
                                                    event[line.url][line.method][line.status].counter++;
                                                } catch (TypeError) {
                                                    if (event[line.url] == undefined) {
                                                        event[line.url] = {};
                                                    }
                                                    if (event[line.url][line.method] == undefined) {
                                                        event[line.url][line.method] = {};
                                                    }
                                                    if (event[line.url][line.method][line.status] == undefined) {
                                                        event[line.url][line.method][line.status] = {
                                                            counter : 1,
                                                        }
                                                    }
                                                }

                                            });
                        } else {
                            // clear
                            event = {};
                        }
                    }

                    return;
                });
app.post('/sta/', middle, function(req, res) {
    /**
     * POST routing. Build static info
     * 
     * @param object req: request
     * @param object res: response
     * @return void
     */

    var statics = {
        date : Date.now(),
        os : {
            hostname : OS.hostname(),
            platform : OS.platform(),
            arch : OS.arch(),
            type : OS.type(),
            release : OS.release(),
        },
        version : process.versions,
        process : {
            gid : process.getgid(),
            uid : process.getuid(),
            pid : process.pid,
            env : process.env,
        },
        network : OS.networkInterfaces(),
    };

    res.json(statics);
    return;
});

/**
 * exports function
 */
exports = module.exports = monitode;
if (!module.parent) {
    // if standalone
    monitode({
        output : true,
    });
}
