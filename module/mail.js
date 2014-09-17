"use strict";
/**
 * @file monitode mail
 * @module monitode
 * @package monitode
 * @subpackage module
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
    var MAIL = require('nodemailer');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/**
 * init for file module. Using global var for sharing info
 * 
 * @exports mail
 * @function mail
 */
module.exports = function mail() {

    /**
     * @global
     */
    var options = GLOBAL.monitode;
    var m = options.mail;
    var timeout, net, io;

    /*
     * functions
     */
    /**
     * email loop
     * 
     * @function file
     */
    function email() {

        clearTimeout(timeout);
        /**
         * @global
         */

        var json = require(options.min + 'lib/obj.js').dynamics(true);
        if (net) {
            json.net = options.net;
            json.io = options.io;
            if (io) {
                net();
                io();
            }
        }
        m.to.text = JSON.stringify(json);
        m.provider.sendMail(m.to,function(error,response) {

            if (error) {
                console.error(error);
            } else {
                timeout = setTimeout(email,m.timeout);
            }
            m.provider.close();
            return;
        });
        return;
    }

    if (options.os) {
        if (options.monitor.os) {
            options.monitor.os = false;
            net = require(options.min + 'lib/net.js')();
            io = require(options.min + 'lib/io.js')();
        } else {
            net = true;
        }
    }
    m.provider = MAIL.createTransport({
        service: m.provider,
        auth: {
            user: m.user,
            pass: m.password
        }
    });
    m.to = {
        from: m.user,
        to: m.to.toString(),
        subject: m.subject
    };
    GLOBAL.monitode.mail.user = GLOBAL.monitode.mail.password = true;
    if (options.output) {
        console.log('starting monitor with email');
    }
    return email();
};
