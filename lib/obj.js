'use strict';
/**
 * @file monitode object
 * @module monitode
 * @package monitode
 * @subpackage lib
 * @version 2.5.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var OS = require('os'), SITEMAP = require('express-sitemap')();
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * functions
 */
/**
 * dynamic datas
 * 
 * @exports dynamics
 * @function dynamics
 * @param {Boolean} [min] - if dysplay Min value
 * @return {Object}
 */
module.exports.dynamics = function(min) {

    var load = OS.loadavg();
    var total = OS.totalmem();
    if (Boolean(min)) {
        return {
            uptime: {
                os: OS.uptime(),
                node: process.uptime(),
            },
            cpu: {
                one: load[0],
                five: load[1],
                fifteen: load[2],
            },
            mem: {
                total: total,
                used: total - OS.freemem(),
            },
        };
    }

    var v8 = process.memoryUsage();
    var cpus = OS.cpus();
    for (var i = 0, ii = cpus.length; i < ii; i++) { // slim json
        cpus[i].model = '';
    }
    var data = {
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
    if (global.tickle) {
        data.tickle = global.tickle.route;
    }
    return data;
};

/**
 * static datas
 * 
 * @exports statics
 * @function statics
 * @param {Object} app - express app
 * @return {Object}
 */
module.exports.statics = function(app) {

    var data = {
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
        endianness: OS.endianness(),
    };
    if (app) {
        data.route = SITEMAP.generate(app);
        SITEMAP.reset();
    }
    return data;
};
