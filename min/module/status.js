"use strict";

try {
    var HTTP = require("http"), HTTPS = require("https"), URL = require("url"), LOGGER = require("logger-request");
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND), process.exit(1);
}

module.exports = function() {
    function complete(res) {
        var status = Math.floor(res.statusCode / 100);
        status >= 4 && console.log(new Date().toUTCString() + " " + res.connection._host + " " + res.statusCode), 
        s.file("moniStatus", {
            host: res.connection._host,
            status: res.statusCode,
            message: res.statusMessage,
            headers: res.headers
        });
    }
    function request() {
        clearTimeout(timeout);
        for (var i = 0, ii = s.site.length; ii > i; i++) {
            var url = URL.parse(s.site[i]), module = HTTP;
            try {
                "https" === url.protocol.substr(0, 5) && (module = HTTPS);
            } catch (TypeError) {}
            var req;
            req = url.hostname ? module.request({
                port: s.port[i],
                hostname: url.hostname,
                headers: {
                    "User-Agent": s.agent
                },
                method: s.method,
                agent: !1
            }, complete) : module.request({
                port: s.port[i],
                host: s.site[i],
                headers: {
                    "User-Agent": s.agent
                },
                method: s.method,
                agent: !1
            }, complete), req.on("error", function(error) {
                console.error(error);
            }), req.end();
        }
        timeout = setTimeout(request, s.timeout);
    }
    var timeout, options = global.monitode, s = options.status;
    return s.file = LOGGER({
        standalone: !0,
        filename: s.file,
        winston: {
            logger: "moniStatus",
            level: "debug",
            maxsize: null,
            json: !1
        }
    }), options.output && console.log("starting monitor with status"), request();
};
