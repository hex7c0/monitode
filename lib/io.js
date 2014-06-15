"use strict";
/**
 * @file monitode io stats
 * @module monitode
 * @package monitode
 * @subpackage lib
 * @version 2.2.7
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
var op = null, timer = 0;
var stat = [0,0];

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

    op = spawn('iostat',['-d','-w','2'],{
        stdio: ['ignore','pipe']
    });
    op.stdout.on('data',function(data) {

        var cache = stat;
        var lines = String(data).split(/\r?\n/);
        for (var i = 0, il = lines.length; i < il; i++) {
            var cap = lines[i].match(/^\s+(\d+(?:\.\d+))\s+(\d+)\s+(\d+(?:\.\d+))\s*/);
            if (cap) {
                cache = [parseFloat(cap[2]) + cache[0],parseFloat(cap[3]) + cache[1]];
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

    op = spawn('iostat',['-d','2','-k','-p','sda'],{
        stdio: ['ignore','pipe']
    });
    op.stdout.on('data',function(data) {

        var cache = stat;
        var lines = String(data).split(/\r?\n/);
        for (var i = 0, il = lines.length; i < il; i++) {
            var cap = lines[i].match(/(\d+(?:\.\d+))\s+(\d+(?:\.\d+))\s+(\d+(?:\.\d+))\s*/);
            if (cap) {
                cache = [parseFloat(cap[1]) + cache[0],
                        parseFloat(cap[2]) + parseFloat(cap[3]) + cache[1]];
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
 * @function refreshMac
 * @return
 */
function refreshMac() {

    /**
     * @global
     */
    GLOBAL._m_io = {
        tps: stat[0],
        mbs: stat[1],
    };
    stat = [0,0];
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
    GLOBAL._m_io = {
        tps: stat[0],
        mbs: stat[1] / 1024,
    };
    stat = [0,0];
    if (timer >= 600) { // refresh spawn
        timer = 0;
        op.kill('SIGTERM');
        op = null;
        main();
    }
    return;
}
/**
 * io bootstrap
 * 
 * @exports main
 * @function main
 * @return {Function}
 */
module.exports = function() {

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
        GLOBAL._m_io = null;
        return function() {

            // not implemented
            return;
        };
    }
};
