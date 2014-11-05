'use strict';
/**
 * @file monitode net stats
 * @module monitode
 * @package monitode
 * @subpackage lib
 * @version 2.6.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var OS = require('os').platform(), spawn = require('child_process').spawn;
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/**
 * net bootstrap
 * 
 * @exports main
 * @function main
 * @return {Function}
 */
module.exports = function net() {

    var op, timer = 0;
    var stat = [ 0, 0, 0, 0 ];
    var story = 0;

    /*
     * functions
     */
    /**
     * mac spawn
     * 
     * @function spawnMac
     */
    function spawnMac() {

        op = spawn('netstat', [ '-w 2' ], {
            stdio: [ 'ignore', 'pipe' ]
        });
        op.stdout
                .on(
                        'data',
                        function(data) {

                            var lines = String(data).split(/\r?\n/);
                            for (var i = 0, il = lines.length; i < il; i++) {
                                var cap = lines[i]
                                        .match(/^\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*/);
                                if (cap) {
                                    stat = [ parseInt(cap[1]) + stat[0],
                                            parseInt(cap[2]) + stat[1],
                                            parseInt(cap[4]) + stat[2],
                                            parseInt(cap[5]) + stat[3] ];
                                }
                            }
                            timer++;
                            return;
                        });
        op.stderr.on('data', function(data) {

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
     */
    function spawnLinux() {

        op = spawn('netstat', [ '-i', '-c', '2' ], {
            stdio: [ 'ignore', 'pipe' ]
        });
        op.stdout
                .on(
                        'data',
                        function(data) {

                            var lines = String(data).split(/\r?\n/);
                            for (var i = 0, il = lines.length; i < il; i++) {
                                var cap = lines[i]
                                        .match(/^([a-zA-z]+[0-9]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)*/);
                                if (cap) {
                                    if (story === 0) {
                                        story = [ parseInt(cap[4]),
                                                parseInt(cap[5]),
                                                parseInt(cap[8]),
                                                parseInt(cap[9]) ];
                                    }
                                    stat = [
                                            parseInt(cap[4]) + stat[0]
                                                    - story[0],
                                            parseInt(cap[5]) + stat[1]
                                                    - story[1],
                                            parseInt(cap[8]) + stat[2]
                                                    - story[2],
                                            parseInt(cap[9]) + stat[3]
                                                    - story[3] ];
                                }
                            }
                            timer++;
                            return;
                        });
        op.stderr.on('data', function(data) {

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
     */
    function refreshMac() {

        /**
         * @global
         */
        global.monitode.net = {
            inn: {
                pacs: stat[0],
                errs: stat[1],
            },
            out: {
                pacs: stat[2],
                errs: stat[3],
            },
        };
        stat = [ 0, 0, 0, 0 ];
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
     */
    function refreshLinux() {

        /**
         * @global
         */
        global.monitode.net = {
            inn: {
                pacs: stat[0],
                errs: stat[1],
            },
            out: {
                pacs: stat[2],
                errs: stat[3],
            },
        };
        stat = [ 0, 0, 0, 0 ];
        if (timer >= 600) { // refresh spawn
            timer = 0;
            op.kill('SIGTERM');
            op = null;
            main();
        }
        return;
    }

    /**
     * os starting point
     * 
     * @function main
     * @return {Function}
     */
    function main() {

        if (OS.toLowerCase() === 'darwin') {
            spawnMac();
            return refreshMac;
        } else if (OS.toLowerCase() === 'linux') {
            spawnLinux();
            return refreshLinux;
        }
        /**
         * @global
         */
        global.monitode.net = null;
        return function() {

            // not implemented
            return;
        };
    }
    return main();
};
