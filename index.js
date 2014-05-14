"use strict";
/**
 * monitode
 * 
 * @package monitode
 * @subpackage index
 * @version 0.0.1
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
    var app = require('express')();
} catch (MODULE_NOT_FOUND) {
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}

// express settings
process.env.NODE_ENV = 'production'
app.enable('case sensitive routing');
app.enable('strict routing');
app.disable('x-powered-by');

app.get('/', function(req, res) {
    res.sendfile('./console/index.html');
});

app.post('/sta/', function(req, res) {
    var start = process.hrtime();

    var statics = {
        hostname : OS.hostname(),
        platform : OS.platform(),
        arch : OS.arch(),
        type : OS.type(),
        release : OS.release(),
        version : {
            node : process.version,
            module : process.versions,
        },
        process : {
            gid : process.getgid(),
            uid : process.getuid(),
            pid : process.pid,
        },
    };

    var diff = process.hrtime(start);
    statics.ns = diff[0] * 1e9 + diff[1];
    res.json(statics);
});

app.post('/dyn/', function(req, res) {
    var start = process.hrtime();

    var load = OS.loadavg();
    var cpu = {
        one : load[0],
        five : load[1],
        fifteen : load[2],
        cpus : OS.cpus(),
    };

    var free = OS.freemem();
    var v8 = process.memoryUsage();
    var mem = {
        total : OS.totalmem(),
        used : OS.totalmem() - free,
        free : free,
        v8 : {
            rss : v8.rss,
            total : v8.heapTotal,
            used : v8.heapUsed,
            free : v8.heapTotal - v8.heapUsed,
        }
    };

    var dynamics = {
        uptime : OS.uptime(),
        cpu : cpu,
        mem : mem,
    };

    var diff = process.hrtime(start);
    dynamics.ns = diff[0] * 1e9 + diff[1];
    res.json(dynamics);
});

app.listen(30000);
console.log('starting server on port 30000');

function monitor(req, res, next) {
    /**
     * ?
     * 
     * @param object req: request
     * @param object res: response
     * @param object next: continue routes
     */

    // end
    next();
};

/**
 * exports function
 */
exports = module.exports = monitor;
