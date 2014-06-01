"use strict";
/**
 * @file monitode io stats
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
var stat = [0,0,0];

/*
 * functions
 */
/**
 * mac refresh spawn
 * 
 * @function macRefresh
 * @return
 */
function macRefresh() {

    GLOBAL._m_io = {
        kbt: stat[0],
        tps: stat[1],
        mbs: stat[2],
    };
    stat = [0,0,0];
    op.kill('SIGHUP');
    // refresh spawn
    main();
    return;
}
/**
 * io bootstrap
 * 
 * @function main
 * @return {function}
 */
function main() {

    var os = OS.platform();
    if (os == 'darwin') {
        var regex = /^\s+(\d+(?:\.\d+))\s+(\d+)\s+(\d+(?:\.\d+))\s*/;
        op = spawn('iostat',['-n 1','-d','-w 1'],{
            stdio: ['ignore','pipe']
        });
        op.stdout.on('data',function(data) {

            var cap = String(data).match(regex);
            if (cap) {
                stat[0] += parseInt(cap[1]);
                stat[1] += parseInt(cap[2]);
                stat[2] += parseInt(cap[3]);
            }
            return;
        });
        op.stderr.on('data',function(data) {

            op.kill('SIGKILL');
            return;
        });
        return macRefresh;
    } else {
        return function() {

            // not implemented
            return;
        };
    }
}
/**
 * function exports
 * 
 * @exports main
 */
module.exports = main;
