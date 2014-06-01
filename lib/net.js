"use strict";
/**
 * @file monitode net stats
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
var stat = [0,0,0,0,0,0];

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

    GLOBAL._m_net = {
        inn: {
            pacs: stat[0],
            errs: stat[1],
            byts: stat[2],
        },
        out: {
            pacs: stat[3],
            errs: stat[4],
            byts: stat[5],
        },
    };
    stat = [0,0,0,0,0,0];
    op.kill('SIGHUP');
    // refresh spawn
    main();
    return;
}
/**
 * net bootstrap
 * 
 * @function main
 * @return {function}
 */
function main() {

    var os = OS.platform();
    if (os == 'darwin') {
        var regex = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*/;
        op = spawn('netstat',['-w 1'],{
            stdio: ['ignore','pipe']
        });
        op.stdout.on('data',function(data) {

            var cap = String(data).match(regex);
            if (cap) {
                stat[0] += parseInt(cap[1]);
                stat[1] += parseInt(cap[2]);
                stat[2] += parseInt(cap[3]);
                stat[3] += parseInt(cap[4]);
                stat[4] += parseInt(cap[5]);
                stat[5] += parseInt(cap[6]);
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
