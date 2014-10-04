'use strict';
/**
 * @file monitode io stats
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
    var OS = require('os').platform(), spawn = require('child_process').spawn;
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/**
 * io bootstrap
 * 
 * @exports io
 * @function io
 * @return {Function}
 */
module.exports = function io() {

    var op, timer = 0;
    var stat = [ 0, 0 ];

    /*
     * functions
     */
    /**
     * mac spawn
     * 
     * @function spawnMac
     */
    function spawnMac() {

        op = spawn('iostat', [ '-d', '-w', '2' ], {
            stdio: [ 'ignore', 'pipe' ]
        });
        op.stdout
                .on(
                        'data',
                        function(data) {

                            var lines = String(data).split(/\r?\n/);
                            for (var i = 0, ii = lines.length; i < ii; i++) {
                                var cap = lines[i]
                                        .match(/^\s+(\d+(?:\.\d+))\s+(\d+)\s+(\d+(?:\.\d+))\s*/);
                                if (cap) {
                                    stat = [ parseFloat(cap[2]) + stat[0],
                                            parseFloat(cap[3]) + stat[1] ];
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

        op = spawn('iostat', [ '-d', '2', '-k', '-p', 'sda' ], {
            stdio: [ 'ignore', 'pipe' ]
        });
        op.stdout
                .on(
                        'data',
                        function(data) {

                            var lines = String(data).split(/\r?\n/);
                            for (var i = 0, il = lines.length; i < il; i++) {
                                var cap = lines[i]
                                        .match(/(\d+(?:\.\d+))\s+(\d+(?:\.\d+))\s+(\d+(?:\.\d+))\s*/);
                                if (cap) {
                                    stat = [
                                            parseFloat(cap[1]) + stat[0],
                                            parseFloat(cap[2])
                                                    + parseFloat(cap[3])
                                                    + stat[1] ];
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
     * @function refreshMac
     */
    function refreshMac() {

        /**
         * @global
         */
        global.monitode.io = {
            tps: stat[0],
            mbs: stat[1],
        };
        stat = [ 0, 0 ];
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
        global.monitode.io = {
            tps: stat[0],
            mbs: stat[1] / 1024,
        };
        stat = [ 0, 0 ];
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
        global.monitode.io = null;
        return function() {

            // not implemented
            return;
        };
    }
    return main();
};
