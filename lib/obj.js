"use strict";
/**
 * @file monitode object
 * @module monitode
 * @package monitode
 * @subpackage lib
 * @version 2.2.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    /**
     * @global
     */
    var OS = require('os');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * functions
 */
/**
 * exports function
 * 
 * @exports dynamics
 * @function dynamics
 * @return
 */
module.exports.dynamics = function dynamics() {

    var load = OS.loadavg();
    var total = OS.totalmem();
    var v8 = process.memoryUsage();
    var cpus = OS.cpus();
    for (var i = 0, il = cpus.length; i < il; i++) { // slim json
        cpus[i].model = '';
    }
    return {
        date: Date.now(),
        ns: process.hrtime(),
        uptime: {
            os: OS.uptime(),
            node: process.uptime(),
        },
        cpu: {
            one: load[0],
            five: load[1],
            fifteen: load[2],
            cpus: cpus,
        },
        mem: {
            total: total,
            used: total - OS.freemem(),
            v8: {
                rss: v8.rss,
                total: v8.heapTotal,
                used: v8.heapUsed,
            },
        },
    };
}
/**
 * exports object
 * 
 * @exports statics
 */
module.exports.statics = {
    os: {
        hostname: OS.hostname(),
        platform: OS.platform(),
        arch: OS.arch(),
        type: OS.type(),
        release: OS.release(),
    },
    version: process.versions,
    process: {
        gid: process.getgid(),
        uid: process.getuid(),
        pid: process.pid,
        env: process.env,
    },
    network: OS.networkInterfaces(),
}
