"use strict";

try {
    var OS = require("os").platform(), spawn = require("child_process").spawn;
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND), process.exit(1);
}

module.exports = function() {
    function spawnMac() {
        op = spawn("netstat", [ "-w 2" ], {
            stdio: [ "ignore", "pipe" ]
        }), op.stdout.on("data", function(data) {
            for (var lines = String(data).split(/\r?\n/), i = 0, il = lines.length; il > i; i++) {
                var cap = lines[i].match(/^\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*/);
                cap && (stat = [ parseInt(cap[1]) + stat[0], parseInt(cap[2]) + stat[1], parseInt(cap[4]) + stat[2], parseInt(cap[5]) + stat[3] ]);
            }
            timer++;
        }), op.stderr.on("data", function(data) {
            console.error(String(data)), op.kill("SIGKILL");
        });
    }
    function spawnLinux() {
        op = spawn("netstat", [ "-i", "-c", "2" ], {
            stdio: [ "ignore", "pipe" ]
        }), op.stdout.on("data", function(data) {
            for (var lines = String(data).split(/\r?\n/), i = 0, il = lines.length; il > i; i++) {
                var cap = lines[i].match(/^([a-zA-z]+[0-9]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)*/);
                cap && (0 === story && (story = [ parseInt(cap[4]), parseInt(cap[5]), parseInt(cap[8]), parseInt(cap[9]) ]), 
                stat = [ parseInt(cap[4]) + stat[0] - story[0], parseInt(cap[5]) + stat[1] - story[1], parseInt(cap[8]) + stat[2] - story[2], parseInt(cap[9]) + stat[3] - story[3] ]);
            }
            timer++;
        }), op.stderr.on("data", function(data) {
            console.error(String(data)), op.kill("SIGKILL");
        });
    }
    function refreshMac() {
        global.monitode.net = {
            inn: {
                pacs: stat[0],
                errs: stat[1]
            },
            out: {
                pacs: stat[2],
                errs: stat[3]
            }
        }, stat = [ 0, 0, 0, 0 ], timer >= 600 && (timer = 0, op.kill("SIGTERM"), op = null, 
        main());
    }
    function refreshLinux() {
        global.monitode.net = {
            inn: {
                pacs: stat[0],
                errs: stat[1]
            },
            out: {
                pacs: stat[2],
                errs: stat[3]
            }
        }, stat = [ 0, 0, 0, 0 ], timer >= 600 && (timer = 0, op.kill("SIGTERM"), op = null, 
        main());
    }
    function main() {
        return "darwin" === OS.toLowerCase() ? (spawnMac(), refreshMac) : "linux" === OS.toLowerCase() ? (spawnLinux(), 
        refreshLinux) : (global.monitode.net = null, function() {});
    }
    var op, timer = 0, stat = [ 0, 0, 0, 0 ], story = 0;
    return main();
};
