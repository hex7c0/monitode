"use strict";

function logger(logfile) {
    var event = global.monitode.event = Object.create(null), log = global.monitode.log, size = FS.statSync(logfile).size, stream = STARTLINE({
        file: logfile,
        flags: "r",
        mode: 444,
        encoding: "utf8",
        start: log.size
    });
    if (log.size < size) {
        log.size = size;
        var parse = function(lines) {
            var line = Object.create(null);
            try {
                line = JSON.parse(lines);
            } catch (e) {
                return;
            }
            log.counter++, event[line.url] && event[line.url][line.method] && event[line.url][line.method][line.status] ? event[line.url][line.method][line.status].counter++ : (void 0 === event[line.url] && (event[line.url] = Object.create(null)), 
            void 0 === event[line.url][line.method] && (event[line.url][line.method] = Object.create(null)), 
            void 0 === event[line.url][line.method][line.status] && (event[line.url][line.method][line.status] = {
                counter: 1
            }));
        };
        stream.on("line", parse);
    }
}

try {
    var FS = require("fs"), STARTLINE = require("startline");
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND), process.exit(1);
}

module.exports = function(logfile) {
    FS.exists(logfile, function(exists) {
        exists && logger(logfile);
    });
};
