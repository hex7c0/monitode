"use strict";

try {
    var CLIENT = require("nano");
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND), process.exit(1);
}

module.exports = function() {
    function with_log(json) {
        var diff = process.hrtime(json.ns);
        json.ns = 1e9 * diff[0] + diff[1], json.event = options.event, d.couch.insert(json, function(error) {
            error ? console.error(error) : timeout = setTimeout(query, d.timeout);
        }), log(options.logger.log);
    }
    function without_log(json) {
        var diff = process.hrtime(json.ns);
        json.ns = 1e9 * diff[0] + diff[1], d.couch.insert(json, function(error) {
            error ? console.error(error) : timeout = setTimeout(query, d.timeout);
        });
    }
    function query() {
        clearTimeout(timeout);
        var json = require(options.min + "lib/obj.js").dynamics();
        net ? (json.net = options.net, json.io = options.io, end(json), io && (net(), io())) : end(json);
    }
    var timeout, log, net, io, options = global.monitode, d = options.db, end = without_log;
    options.os && (options.monitor.os ? (options.monitor.os = !1, net = require(options.min + "lib/net.js")(), 
    io = require(options.min + "lib/io.js")()) : net = !0), options.logger.log && (end = with_log, 
    options.monitor.log ? (options.monitor.log = !1, log = require(options.min + "lib/log.js")) : log = function() {}), 
    d.couch = CLIENT(d.couch), options.output && console.log("starting monitor on CouchDb database"), 
    query();
};
