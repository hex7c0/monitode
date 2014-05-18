"use strict";
/**
 * monitode
 * 
 * @package monitode
 * @subpackage index
 * @version 1.0.7
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
    // personal
    var EXPRESS = require('express');
    // load
    process.env.NODE_ENV = 'production';
    var app = EXPRESS();
} catch (MODULE_NOT_FOUND) {
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}
// express settings
app.enable('case sensitive routing');
app.enable('strict routing');
app.disable('x-powered-by');
app.use(EXPRESS.static(__dirname + '/public/'));
var AUTH = require('basic-auth');
var start = 0;
var diff = 0;
// init
function monitode(options) {
    /**
     * setting options
     * 
     * @param object options: various options. check README.md
     * @return function
     */

    var options = options || {};
    options.port = parseInt(options.port) || 30000;
    options.output = Boolean(options.output);
    options.password = options.password || 'password';
    options.agent = options.agent || null;
    app.set('options', options);

    app.listen(options.port);
    if (options.output) {
        console.log('starting monitor on port ' + options.port);
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

    if (user === undefined || user['name'] !== 'admin'
            || user['pass'] !== options.password) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Monitode"');
        res.status(401).end('Unauthorized');
    } else if (options.agent && options.agent === req.headers['user-agent']) {
        next();
    } else if (!options.agent) {
        next();
    } else {
        res.status(403).end('Forbidden');
    }
    return;
}

/**
 * routing
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
app.post('/sta/', middle, function(req, res) {
    /**
     * POST routing. Build static info
     * 
     * @param object req: request
     * @param object res: response
     * @return void
     */

    start = process.hrtime();
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

    diff = process.hrtime(start);
    statics.ns = diff[0] * 1e9 + diff[1];
    res.json(statics);
    return;
});
app.post('/dyn/', middle, function(req, res) {
    /**
     * POST routing. Build dynamic info
     * 
     * @param object req: request
     * @param object res: response
     * @return void
     */

    start = process.hrtime();
    var load = OS.loadavg();
    var free = OS.freemem();
    var v8 = process.memoryUsage();
    var dynamics = {
        date : Date.now(),
        uptimeS : OS.uptime(),
        uptimeN : process.uptime(),
        cpu : {
            one : load[0],
            five : load[1],
            fifteen : load[2],
            cpus : OS.cpus(),
        },
        mem : {
            total : OS.totalmem(),
            used : OS.totalmem() - free,
            free : free,
            v8 : {
                rss : v8.rss,
                total : v8.heapTotal,
                used : v8.heapUsed,
                free : v8.heapTotal - v8.heapUsed,
            },
        },
    };

    diff = process.hrtime(start);
    dynamics.ns = diff[0] * 1e9 + diff[1];
    res.json(dynamics);
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
