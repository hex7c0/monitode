"use strict";
/**
 * web module
 * 
 * @package monitode
 * @subpackage module
 * @version 2.1.0
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
    var EXPRESS = require('express');
    var AUTH = require('basic-auth');
} catch (MODULE_NOT_FOUND){
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
var app = EXPRESS();
var log = null;
var end = without_log;

/**
 * functions
 */
function auth(req,res,next){
    /**
     * protection middleware
     * 
     * @param object req: request
     * @param object res: response
     * @param object next: continue routes
     * @return void
     */

    var options = GLOBAL._m_options.http;
    var user = AUTH(req);

    if (user === undefined || user['name'] !== options.user || user['pass'] !== options.password){
        res.setHeader('WWW-Authenticate','Basic realm="monitode"');
        res.status(401).end('Unauthorized');
    } else if (options.agent && options.agent === req.headers['user-agent']){
        next();
    } else if (!options.agent){
        next();
    } else{
        res.status(403).end('Forbidden');
    }
    return;
}
function with_log(res,json){
    /**
     * sending object
     * 
     * @param object res: response
     * @param object json: builded object
     * @return void
     */

    var options = GLOBAL._m_options.logger.log;
    json.log = GLOBAL._m_log;
    json.event = GLOBAL._m_event;
    res.json(json);
    res.end();
    log(options);
    return;
}
function without_log(res,json){
    /**
     * sending object
     * 
     * @param object res: response
     * @param object json: builded object
     * @return void
     */

    res.json(json);
    return;
}

/**
 * express routing
 */
app.get('/',auth,function(req,res){
    /**
     * GET routing. Send html file
     * 
     * @param object req: request
     * @param object res: response
     * @return void
     */

    res.sendfile(process.env._m_main + '/console/index.html');
    return;
});
app.post('/dyn/',auth,function(req,res){
    /**
     * POST routing. Build dynamic info
     * 
     * @param object req: request
     * @param object res: response
     * @return void
     */

    var start = process.hrtime();
    var load = OS.loadavg();
    var total = OS.totalmem();
    var v8 = process.memoryUsage();
    var cpus = OS.cpus();
    for (var i = 0, il = cpus.length; i < il; i++){ // slim json
        cpus[i].model = '';
    }
    var dynamics = {
        date: Date.now(),
        uptimeS: OS.uptime(),
        uptimeN: process.uptime(),
        cpu: {
            one: load[0],
            five: load[1],
            fifteen: load[2],
            cpus: cpus,
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
    var diff = process.hrtime(start);
    dynamics.ns = diff[0] * 1e9 + diff[1];
    end(res,dynamics);
    return;
});
app.post('/sta/',auth,function(req,res){
    /**
     * POST routing. Build static info
     * 
     * @param object req: request
     * @param object res: response
     * @return void
     */

    var statics = {
        os: {
            hostname: OS.hostname(),
            platform: OS.platform(),
            arch: OS.arch(),
            type: OS.type(),
            release: OS.release(),
        },
        version: process.versions,
        process: {
            gid: process.getgid(),
            uid: process.getuid(),
            pid: process.pid,
            env: process.env,
        },
        network: OS.networkInterfaces(),
    };
    res.json(statics);
    return;
});

/**
 * exports function
 */
module.exports = function(){
    /**
     * init for web module. Using global var for sharing info
     * 
     * @return void
     */

    var options = GLOBAL._m_options;
    if (options.logger.log){
        log = require('./lib/log.js');
        end = with_log;
    }
    app.enable('case sensitive routing');
    app.enable('strict routing');
    app.disable('x-powered-by');
    app.use(EXPRESS.static(process.env._m_main + '/public/'));
    if (options.output){
        console.log('starting monitor on port ' + options.http.port);
    }
    app.listen(options.http.port);
    return;
};
