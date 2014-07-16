"use strict";
/**
 * @file monitode mail
 * @module monitode
 * @package monitode
 * @subpackage module
 * @version 2.2.18
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
// load
var timeout = null, net = null, io = null;

/*
 * functions
 */
/**
 * email loop
 * 
 * @function file
 * @return
 */
function email() {

    clearTimeout(timeout);
    /**
     * @global
     */
    var global = GLOBAL.monitode;
    var options = global.mail;
    var json = require('../lib/obj.js').dynamics(true);
    if (net) {
        json.net = global.net;
        json.io = global.io;
        if (io) {
            net();
            io();
        }
    } else {
        // pass
    }
    options.to.text = JSON.stringify(json);
    options.provider.sendMail(options.to,function(error,response) {

        if (error) {
            console.error(error);
        } else {
            timeout = setTimeout(email,options.timeout);
        }
        options.provider.close();
        return;
    });
    return;
}
/**
 * init for file module. Using global var for sharing info
 * 
 * @exports main
 * @function main
 * @return
 */
module.exports = function() {

    /**
     * @global
     */
    var options = GLOBAL.monitode;
    if (options.os) {
        if (options.monitor.os) {
            options.monitor.os = false;
            net = require('../lib/net.js')();
            io = require('../lib/io.js')();
        } else {
            net = true;
        }
    }
    options.mail.provider = MAIL.createTransport({
        service: options.mail.provider,
        auth: {
            user: options.mail.user,
            pass: options.mail.password,
        }
    });
    options.mail.to = {
        from: options.mail.user + ' <' + options.mail.user + '>',
        to: options.mail.to.toString(),
        subject: options.mail.subject,
    };
    if (options.output) {
        console.log('starting monitor with email');
    }
    email();
    return;
};
