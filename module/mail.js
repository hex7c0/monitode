"use strict";
/**
 * mail module
 * 
 * @file monitode mail
 * @module monitode
 * @subpackage module
 * @version 2.1.2
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    // global
    /**
     * @global
     */
    var OS = require('os');
    // personal
    /**
     * @global
     */
    var MAIL = require('nodemailer');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
/**
 * @global
 */
var timeout = null;

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
    var options = GLOBAL._m_options.mail;
    var load = OS.loadavg();
    var total = OS.totalmem();
    var v8 = process.memoryUsage();
    var text = {
        date: new Date().toUTCString(),
        cpu: {
            one: load[0],
            five: load[1],
            fifteen: load[2],
        },
        mem: {
            total: total,
            used: total - OS.freemem(),
            v8: {
                rss: v8.rss,
                total: v8.heapTotal,
                used: v8.heapUsed,
            },
        },
    };
    options.to.text = JSON.stringify(text);
    options.provider.sendMail(options.to,function(error,response) {
        if (error) {
            console.log(error);
        } else {
            timeout = setTimeout(email,options.timeout);
        }
        options.provider.close();
    });
    return;

}
/**
 * init for file module. Using global var for sharing info
 * 
 * @function main
 * @return
 */
function main() {

    var options = GLOBAL._m_options;
    options.mail.provider = MAIL.createTransport('SMTP',{
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
    timeout = setTimeout(email,0);
    return;

}

/**
 * exports function
 * 
 * @export main
 */
module.exports = main;
