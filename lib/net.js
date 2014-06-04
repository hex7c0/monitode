"use strict";
/**
 * @file monitode net stats
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
var stat = [0,0,0,0], story = 0;

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

    var regex = /^\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*/;
    op = spawn('netstat',['-w 1'],{
        stdio: ['ignore','pipe']
    });
    op.stdout.on('data',function(data) {

        var lines = ('' + String(data)).split(/\r?\n/);
        for (var i = 0, il = lines.length; i < il; i++) {
            var cap = lines[i].match(regex);
            if (cap) {
                stat[0] += parseInt(cap[1]);
                stat[1] += parseInt(cap[2]);
                stat[2] += parseInt(cap[4]);
                stat[3] += parseInt(cap[5]);
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

    var regex = /^([a-zA-z]+[0-9]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)*/;
    op = spawn('netstat',['-i','-c','1'],{
        stdio: ['ignore','pipe']
    });
    op.stdout.on('data',function(data) {

        var lines = ('' + String(data)).split(/\r?\n/);
        for (var i = 0, il = lines.length; i < il; i++) {
            var cap = lines[i].match(regex);
            if (cap) {
                if (story == 0) {
                    story = [parseInt(cap[4]),parseInt(cap[5]),parseInt(cap[8]),parseInt(cap[9])]
                }
                stat[0] += parseInt(cap[4]) - story[0];
                stat[1] += parseInt(cap[5]) - story[1];
                stat[2] += parseInt(cap[8]) - story[2];
                stat[3] += parseInt(cap[9]) - story[3];
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
 * @function macRefresh
 * @return
 */
function refreshMac() {

    GLOBAL._m_net = {
        inn: {
            pacs: stat[0],
            errs: stat[1],
        },
        out: {
            pacs: stat[3],
            errs: stat[4],
        },
    };
    stat = [0,0,0,0];
    return;
}
/**
 * linux refresh spawn
 * 
 * @function refreshLinux
 * @return
 */
function refreshLinux() {

    GLOBAL._m_net = {
        inn: {
            pacs: stat[0],
            errs: stat[1],
        },
        out: {
            pacs: stat[3],
            errs: stat[4],
        },
    };
    stat = [0,0,0,0];
    return;
}
/**
 * net bootstrap
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
        GLOBAL._m_net = null;
        return function() {

            // not implemented
            return;
        };
    }
}
