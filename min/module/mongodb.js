"use strict";

try {
    var CLIENT = require("mongodb").MongoClient;
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND), process.exit(1);
}

module.exports = function() {
    function with_log(json) {
        var diff = process.hrtime(json.ns);
        json.ns = 1e9 * diff[0] + diff[1], json.event = options.event, d.mongo.insertOne(json, function(err) {
            null === err ? timeout = setTimeout(query, d.timeout) : console.error(err);
        }), log(options.logger.log);
    }
    function without_log(json) {
        var diff = process.hrtime(json.ns);
        json.ns = 1e9 * diff[0] + diff[1], d.mongo.insertOne(json, function(err) {
            null === err ? timeout = setTimeout(query, d.timeout) : console.error(err);
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
    CLIENT.connect(d.mongo, function(error, database) {
        error ? console.error(error) : database.createCollection(d.database, function(error, collection) {
            error ? console.error(error) : (d.mongo = collection, options.output && console.log("starting monitor on MongoDb database"), 
            query());
        });
    });
};
