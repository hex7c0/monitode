"use strict";

try {
    var MAIL = require("nodemailer");
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND), process.exit(1);
}

module.exports = function() {
    function email() {
        clearTimeout(timeout);
        var json = require(options.min + "lib/obj.js").dynamics(!0);
        net && (json.net = options.net, json.io = options.io, io && (net(), io())), m.to.text = JSON.stringify(json), 
        m.provider.sendMail(m.to, function(error) {
            error ? console.error(error) : timeout = setTimeout(email, m.timeout), m.provider.close();
        });
    }
    var timeout, net, io, options = global.monitode, m = options.mail;
    return options.os && (options.monitor.os ? (options.monitor.os = !1, net = require(options.min + "lib/net.js")(), 
    io = require(options.min + "lib/io.js")()) : net = !0), m.provider = MAIL.createTransport({
        service: m.provider,
        auth: {
            user: m.user,
            pass: m.password
        }
    }), m.to = {
        from: m.user,
        to: m.to.toString(),
        subject: m.subject
    }, global.monitode.mail.user = global.monitode.mail.password = !0, options.output && console.log("starting monitor with email"), 
    email();
};
