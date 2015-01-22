"use strict";

try {
    var LOGGER = require("logger-request");
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND), process.exit(1);
}

module.exports = function() {
    function write() {
        clearTimeout(timeout), f.file("moniFile", require(options.min + "lib/obj.js").dynamics(!0)), 
        timeout = setTimeout(write, f.timeout);
    }
    var timeout, options = global.monitode, f = options.logger;
    return options.output && console.log("starting monitor on file " + f.file), f.file = LOGGER({
        standalone: !0,
        filename: f.file,
        winston: {
            logger: "moniFile",
            level: "debug",
            maxsize: null,
            json: !1
        }
    }), write();
};
