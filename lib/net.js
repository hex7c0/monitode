"use strict";
/**
 * @file monitode net stats
 * @module monitode
 * @package monitode
 * @subpackage lib
 * @version 2.2.5
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var OS = require('os');
    var spawn = require('child_process').spawn;
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
var op = null, stat = [0,0,0,0], timer = 0;
var story = 0;

/*
 * functions
 */
/**
 * mac spawn
 * 
 * @function spawnMac
 * @return
 */
function spawnMac() {

    op = spawn('netstat',['-w 2'],{
        stdio: ['ignore','pipe']
    });
    op.stdout.on('data',function(data) {

        var cache = stat;
        var lines = String(data).split(/\r?\n/);
        for (var i = 0, il = lines.length; i < il; i++) {
            var cap = lines[i].match(/^\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*/);
            if (cap) {
                cache = [parseInt(cap[1]) + cache[0],parseInt(cap[2]) + cache[1],
                        parseInt(cap[4]) + cache[2],parseInt(cap[5]) + cache[3]];
            }
        }
        stat = cache;
        timer += 1;
        return;
    });
    op.stderr.on('data',function(data) {

        console.error(String(data));
        op.kill('SIGKILL');
        return;
    });
    return;
}
/**
 * linux spawn
 * 
 * @function spawnLinux
 * @return
 */
function spawnLinux() {

    op = spawn('netstat',['-i','-c','2'],{
        stdio: ['ignore','pipe']
    });
    op.stdout
            .on(
                    'data',
                    function(data) {

                        var cache = stat;
                        var lines = String(data).split(/\r?\n/);
                        for (var i = 0, il = lines.length; i < il; i++) {
                            var cap = lines[i]
                                    .match(/^([a-zA-z]+[0-9]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)*/);
                            if (cap) {
                                if (story == 0) {
                                    story = [parseInt(cap[4]),parseInt(cap[5]),parseInt(cap[8]),
                                            parseInt(cap[9])];
                                }
                                cache = [parseInt(cap[4]) + cache[0] - story[0],
                                        parseInt(cap[5]) + cache[1] - story[1],
                                        parseInt(cap[8]) + cache[2] - story[2],
                                        parseInt(cap[9]) + cache[3] - story[3]];
                            }
                        }
                        stat = cache;
                        timer += 1;
                        return;
                    });
    op.stderr.on('data',function(data) {

        console.error(String(data));
        op.kill('SIGKILL');
        return;
    });
    return;
}
/**
 * mac refresh spawn
 * 
 * @function macRefresh
 * @return
 */
function refreshMac() {

    /**
     * @global
     */
    GLOBAL._m_net = {
        inn: {
            pacs: stat[0],
            errs: stat[1],
        },
        out: {
            pacs: stat[2],
            errs: stat[3],
        },
    };
    stat = [0,0,0,0];
    if (timer >= 600) { // refresh spawn
        timer = 0;
        op.kill('SIGTERM');
        op = null;
        main();
    }
    return;
}
/**
 * linux refresh spawn
 * 
 * @function refreshLinux
 * @return
 */
function refreshLinux() {

    /**
     * @global
     */
    GLOBAL._m_net = {
        inn: {
            pacs: stat[0],
            errs: stat[1],
        },
        out: {
            pacs: stat[2],
            errs: stat[3],
        },
    };
    stat = [0,0,0,0];
    if (timer >= 600) { // refresh spawn
        timer = 0;
        op.kill('SIGTERM');
        op = null;
        main();
    }
    return;
}
/**
 * net bootstrap
 * 
 * @exports main
 * @function main
 * @return {Function}
 */
var main = module.exports = function() {

    var os = OS.platform();
    if (os == 'darwin') {
        spawnMac();
        return refreshMac;
    } else if (os == 'linux') {
        spawnLinux();
        return refreshLinux;
    } else {
        /**
         * @global
         */
        GLOBAL._m_net = null;
        return function() {

            // not implemented
            return;
        };
    }
};
