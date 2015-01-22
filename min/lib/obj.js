"use strict";

try {
    var OS = require("os"), SITEMAP = require("express-sitemap")();
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND), process.exit(1);
}

module.exports.dynamics = function(min) {
    var load = OS.loadavg(), total = OS.totalmem();
    if (Boolean(min)) return {
        uptime: {
            os: OS.uptime(),
            node: process.uptime()
        },
        cpu: {
            one: load[0],
            five: load[1],
            fifteen: load[2]
        },
        mem: {
            total: total,
            used: total - OS.freemem()
        }
    };
    for (var v8 = process.memoryUsage(), cpus = OS.cpus(), i = 0, ii = cpus.length; ii > i; i++) cpus[i].model = "";
    var data = {
        date: Date.now(),
        ns: process.hrtime(),
        uptime: {
            os: OS.uptime(),
            node: process.uptime()
        },
        cpu: {
            one: load[0],
            five: load[1],
            fifteen: load[2],
            cpus: cpus
        },
        mem: {
            total: total,
            used: total - OS.freemem(),
            v8: {
                rss: v8.rss,
                total: v8.heapTotal,
                used: v8.heapUsed
            }
        }
    };
    return global.tickle && (data.tickle = global.tickle.route), data;
}, module.exports.statics = function(app) {
    var data = {
        os: {
            hostname: OS.hostname(),
            platform: OS.platform(),
            arch: OS.arch(),
            type: OS.type(),
            release: OS.release()
        },
        version: process.versions,
        process: {
            gid: process.getgid(),
            uid: process.getuid(),
            pid: process.pid,
            env: process.env
        },
        network: OS.networkInterfaces(),
        endianness: OS.endianness()
    };
    return app && (data.route = SITEMAP.generate(app), SITEMAP.reset()), data;
};
