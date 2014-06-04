"use strict";
/**
 * @file monitode io stats
 * @module monitode
 * @package monitode
 * @subpackage lib
 * @version 2.2.2
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
    /**
     * @global
     */
    var spawn = require('child_process').spawn;
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
/**
 * @global
 */
var op = null;
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

    var regex = /^\s+(\d+(?:\.\d+))\s+(\d+)\s+(\d+(?:\.\d+))\s*/;
    op = spawn('iostat',['-d','-w','1'],{
        stdio: ['ignore','pipe']
    });
    op.stdout.on('data',function(data) {

        var lines = ('' + String(data)).split(/\r?\n/);
        for (var i = 0, il = lines.length; i < il; i++) {
            var cap = lines[i].match(regex);
            if (cap) {
                stat[0] += parseFloat(cap[2]); // tps
                stat[1] += parseFloat(cap[3]); // MB/s
            }
        }
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

    var regex = /(\d+(?:\.\d+))\s+(\d+(?:\.\d+))\s+(\d+(?:\.\d+))\s*/;
    op = spawn('iostat',['-d','1','-k','-p','sda'],{
        stdio: ['ignore','pipe']
    });
    op.stdout.on('data',function(data) {

        var lines = ('' + String(data)).split(/\r?\n/);
        for (var i = 0, il = lines.length; i < il; i++) {
            var cap = lines[i].match(regex);
            if (cap) {
                stat[0] += parseFloat(cap[1]); // tps
                stat[1] += parseFloat(cap[2]); // kB_read/s
                stat[1] += parseFloat(cap[3]); // kB_wrtn/s
            }
        }
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

    GLOBAL._m_io = {
        tps: stat[0],
        mbs: stat[1],
    };
    stat = [0,0];
    return;
}
/**
 * linux refresh spawn
 * 
 * @function refreshLinux
 * @return
 */
function refreshLinux() {

    GLOBAL._m_io = {
        tps: stat[0],
        mbs: stat[1] / 1024,
    };
    stat = [0,0];
    return;
}
/**
 * io bootstrap
 * 
 * @exports main
 * @function main
 * @return {function}
 */
module.exports = function main() {

    var os = OS.platform();
    if (os == 'darwin') {
        spawnMac();
        return refreshMac;
    } else if (os == 'linux') {
        spawnLinux();
        return refreshLinux;
    } else {
        GLOBAL._m_io = null;
        return function() {

            // not implemented
            return;
        };
    }
}
