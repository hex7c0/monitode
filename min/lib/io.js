"use strict";

try {
    var OS = require("os").platform(), spawn = require("child_process").spawn;
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND), process.exit(1);
}

module.exports = function() {
    function spawnMac() {
        op = spawn("iostat", [ "-d", "-w", "2" ], {
            stdio: [ "ignore", "pipe" ]
        }), op.stdout.on("data", function(data) {
            for (var lines = String(data).split(/\r?\n/), i = 0, ii = lines.length; ii > i; i++) {
                var cap = lines[i].match(/^\s+(\d+(?:\.\d+))\s+(\d+)\s+(\d+(?:\.\d+))\s*/);
                cap && (stat = [ parseFloat(cap[2]) + stat[0], parseFloat(cap[3]) + stat[1] ]);
            }
            timer++;
        }), op.stderr.on("data", function(data) {
            console.error(String(data)), op.kill("SIGKILL");
        });
    }
    function spawnLinux() {
        op = spawn("iostat", [ "-d", "2", "-k", "-p", "sda" ], {
            stdio: [ "ignore", "pipe" ]
        }), op.stdout.on("data", function(data) {
            for (var lines = String(data).split(/\r?\n/), i = 0, il = lines.length; il > i; i++) {
                var cap = lines[i].match(/(\d+(?:\.\d+))\s+(\d+(?:\.\d+))\s+(\d+(?:\.\d+))\s*/);
                cap && (stat = [ parseFloat(cap[1]) + stat[0], parseFloat(cap[2]) + parseFloat(cap[3]) + stat[1] ]);
            }
            timer++;
        }), op.stderr.on("data", function(data) {
            console.error(String(data)), op.kill("SIGKILL");
        });
    }
    function refreshMac() {
        global.monitode.io = {
            tps: stat[0],
            mbs: stat[1]
        }, stat = [ 0, 0 ], timer >= 600 && (timer = 0, op.kill("SIGTERM"), op = null, main());
    }
    function refreshLinux() {
        global.monitode.io = {
            tps: stat[0],
            mbs: stat[1] / 1024
        }, stat = [ 0, 0 ], timer >= 600 && (timer = 0, op.kill("SIGTERM"), op = null, main());
    }
    function main() {
        return "darwin" === OS.toLowerCase() ? (spawnMac(), refreshMac) : "linux" === OS.toLowerCase() ? (spawnLinux(), 
        refreshLinux) : (global.monitode.io = null, function() {});
    }
    var op, timer = 0, stat = [ 0, 0 ];
    return main();
};
