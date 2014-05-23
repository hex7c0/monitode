"use strict";
/**
 * file module
 * 
 * @package monitode
 * @subpackage module
 * @version 2.0.0
 * @author hex7c0 <0x7c0@teboss.tk>
 * @license GPLv3
 * @copyright hex7c0 2014
 */

/**
 * initialize module
 * 
 * @global
 */
// import
try{
    // global
    var OS = require('os');
    // personal
    var MAIL = require('nodemailer');
} catch (MODULE_NOT_FOUND){
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}
var timeout = null;

/**
 * functions
 */
function email(){
    /**
     * email loop
     * 
     * @return void
     */

    clearTimeout(timeout);
    var options = GLOBAL._m_options.mail;

    var load = OS.loadavg();
    var free = OS.freemem();
    var v8 = process.memoryUsage();
    var text = {
        date: new Date().toUTCString(),
        cpu: {
            one: load[0],
            five: load[1],
            fifteen: load[2],
        },
        mem: {
            total: OS.totalmem(),
            used: OS.totalmem() - free,
            v8: {
                v8rss: v8.rss,
                v8total: v8.heapTotal,
                v8used: v8.heapUsed,
            },
        },
    };
    options.to.text = JSON.stringify(text);
    options.provider.sendMail(options.to,function(error,response){
        if (error){
            console.log(error);
        }
        // options.provider.sendMail.close();
    });

    timeout = setTimeout(email,options.timeout);
    return;
}

/**
 * exports function
 */
module.exports = function(){
    /**
     * init for file module. Using global var for sharing info
     * 
     * @return void
     */

    var options = GLOBAL._m_options;

    options.mail.provider = MAIL.createTransport('SMTP',{
        service: options.mail.provider,
        auth: {
            user: options.mail.user,
            pass: options.mail.password,
        }
    });
    options.mail.to = {
        from: '<' + options.mail.user + '>',
        to: options.mail.to.toString(),
        subject: options.mail.subject,
    };

    if (options.output){
        console.log('starting monitor with email');
    }
    timeout = setTimeout(email,0);
    return;
};
