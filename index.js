"use strict";
/**
 * monitode
 * 
 * @package monitode
 * @subpackage index
 * @version 1.0.6
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
var auth = require('basic-auth');
var password = null;

// init
function monitor(options) {
    /**
     * setting options
     * 
     * @param object options: various options. check README.md
     * @return function
     */

    var options = options || {};
    options.port = parseInt(options.port) || 30000;
    options.output = Boolean(options.output);
    password = options.password || 'password';

    app.listen(options.port);
    if (options.output) {
        console.log('starting monitor on port ' + options.port);
    }

    return function logging(req, res, next) {
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

// routing
app.get('/', function(req, res) {
    var user = auth(req);

    if (user === undefined || user['name'] !== 'admin'
            || user['pass'] !== password) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Monitode"');
        res.end('Unauthorized');
    } else {
        res.sendfile(__dirname + '/console/index.html');
    }
});
app.post('/sta/', function(req, res) {
    var start = process.hrtime();

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

    var diff = process.hrtime(start);
    statics.ns = diff[0] * 1e9 + diff[1];
    res.json(statics);
});
app.post('/dyn/', function(req, res) {
    var start = process.hrtime();
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

    var diff = process.hrtime(start);
    dynamics.ns = diff[0] * 1e9 + diff[1];
    res.json(dynamics);
});

/**
 * exports function
 */
exports = module.exports = monitor;
if (!module.parent) {
    // if standalone
    monitor({
        output : true,
    });
}
