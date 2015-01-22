"use strict";

try {
    var HTTP = require("http"), EXPRESS = require("express"), status = HTTP.STATUS_CODES;
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND), process.exit(1);
}

module.exports = function() {
    function with_log(res, json) {
        var diff = process.hrtime(json.ns);
        json.log = options.log, json.event = options.event, json.ns = 1e9 * diff[0] + diff[1], 
        res.json(json), log(options.logger.log);
    }
    function without_log(res, json) {
        var diff = process.hrtime(json.ns);
        json.ns = 1e9 * diff[0] + diff[1], res.json(json);
    }
    var log, net, io, options = global.monitode, h = options.http, app = EXPRESS(), end = without_log;
    options.os && (options.monitor.os ? (options.monitor.os = !1, net = require(options.min + "lib/net.js")(), 
    io = require(options.min + "lib/io.js")()) : net = !0), options.logger.log && (end = with_log, 
    options.monitor.log ? (options.monitor.log = !1, log = require(options.min + "lib/log.js")) : log = function() {}), 
    app.disable("x-powered-by"), app.disable("etag"), app.disable("view cache"), app.enable("case sensitive routing"), 
    app.enable("strict routing"), app.use(require("server-signature")()), app.use(require("timeout-request")({
        milliseconds: 4e3
    })), app.use(require("basic-authentication")({
        user: h.user,
        password: h.password,
        agent: h.agent,
        realm: h.realm,
        file: h.file,
        hash: h.hash,
        suppress: !0
    }));
    var dir = h.dir, html = dir + "monitode.html";
    app.use(EXPRESS["static"](dir)), options.output && console.log("starting monitor on port " + h.port), 
    HTTP.createServer(app).listen(h.port), global.monitode.http = !0, app.get("/", function(req, res) {
        return res.sendFile(html);
    }), app.post("/dyn/", function(req, res) {
        var json = require(options.min + "lib/obj.js").dynamics();
        net ? (json.net = options.net, json.io = options.io, end(res, json), io && (net(), 
        io())) : end(res, json);
    }), app.post("/sta/", function(req, res) {
        res.json(require(options.min + "lib/obj.js").statics(options.app));
    }), app.use(function(err, req, res, next) {
        var code = 500, out = "";
        switch (err.message.toLowerCase()) {
          case "not found":
            return next();

          default:
            out = err.message.toLowerCase();
        }
        res.status(code).json({
            error: out || status[code].toLowerCase()
        });
    }), app.use(function(req, res) {
        var code = 404;
        res.status(code).json({
            error: status[code].toLowerCase()
        });
    });
};
