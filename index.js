"use strict";
/**
 * monitode
 * 
 * @package monitode
 * @subpackage index
 * @version 1.3.1
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
    var OS = require('os'); // !important
    var FS = require('fs');
    var READLINE = require('readline');
    // personal
    var EXPRESS = require('express');
    var AUTH = require('basic-auth');
    var LOGGER = require('logger-request');
    var CLIENT = require('mongodb').MongoClient;
    // load
    process.env.NODE_ENV = 'production';
    var app = EXPRESS();
} catch (MODULE_NOT_FOUND){
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}

// variables
var timeout = {
    file: null,
    query: null,
};
var log = {
    counter: 0,
    size: 0,
};
var event = {};

// init
function monitode(options){
    /**
     * option setting
     * 
     * @param object options: various options. Check README.md
     * @return function
     */

    var options = options || {};
    options.output = Boolean(options.output);
    options.timeout = (parseInt(options.timeout) || 5) * 1000;
    // http
    options.http = {};
    options.http.enabled = options.web == false ? false : true;
    options.http.port = parseInt(options.port) || 30000;
    options.http.user = String(options.user || 'admin');
    options.http.password = String(options.password || 'password');
    options.http.agent = options.agent || null;
    // logger
    options.logger = {};
    options.logger.log = options.log || null;
    options.logger.file = options.file || null;
    // database
    options.db = {};
    options.db.mongo = options.mongo || null;
    options.db.database = null;

    GLOBAL._options = options;

    if (options.http.enabled){
        // express runnning
        app.enable('case sensitive routing');
        app.enable('strict routing');
        app.disable('x-powered-by');
        app.use(EXPRESS.static(__dirname + '/public/'));
        if (options.output){
            console.log('starting monitor on port ' + options.http.port);
        }
        app.listen(options.http.port);
    } else{
        // remove obsolete
        EXPRESS = AUTH = app = auth = null;
    }
    if (options.logger.file){
        // logger-request
        options.logger.file = LOGGER({
            logger: 'monitode',
            level: 'debug',
            filename: options.logger.file,
            maxsize: null,
            json: false,
            standalone: true,
        });
        if (options.output){
            console.log('starting monitor on file ' + options.logger.file);
        }
        timeout.file = setTimeout(file,0);
    } else{
        // remove obsolete
        LOGGER = file = null;
    }
    if (options.db.mongo){
        // mongodb runnning
        CLIENT.connect(options.db.mongo,function(error,database){
            if (error){
                console.log(error);
            } else{
                database.createCollection('monitode',function(error,collection){
                    if (error){
                        console.log(error);
                    } else{
                        options.db.database = collection;
                        if (options.output){
                            console.log('starting monitor on database');
                        }
                        timeout.query = setTimeout(query,0);
                    }
                });
            }
        });
    } else{
        // remove obsolete
        CLIENT = query = null;
    }
    if (!options.logger.log){
        // remove obsolete
        FS = READLINE = logger = log = event = null;
    }

    return function monitor(req,res,next){
        /**
         * future implementation
         * 
         * @param object req: request
         * @param object res: response
         * @param object next: continue routes
         * @return function
         */

        return next();
    };
}

/**
 * functions
 */
function file(){
    /**
     * file loop
     * 
     * @return void
     */

    clearTimeout(timeout.file);
    var options = GLOBAL._options;

    var load = OS.loadavg();
    var free = OS.freemem();
    var v8 = process.memoryUsage();
    var write = {
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
    options.logger.file('monitode',write);

    timeout.file = setTimeout(file,options.timeout);
    return;
}
function query(){
    /**
     * query loop
     * 
     * @return void
     */

    var start = process.hrtime();
    clearTimeout(timeout.query);
    var options = GLOBAL._options;

    var load = OS.loadavg();
    var free = OS.freemem();
    var v8 = process.memoryUsage();
    var insert = {
        date: Date.now(),
        uptime: {
            os: OS.uptime(),
            node: process.uptime(),
        },
        cpu: {
            one: load[0],
            five: load[1],
            fifteen: load[2],
        },
        mem: {
            total: OS.totalmem(),
            used: OS.totalmem() - free,
            v8: {
                rss: v8.rss,
                total: v8.heapTotal,
                used: v8.heapUsed,
            },
        },
        event: event,
    };

    var diff = process.hrtime(start);
    insert.ns = diff[0] * 1e9 + diff[1];
    options.db.database.insert(insert,function(error,result){
        if (error){
            console.log(error);
        } else{
            timeout.query = setTimeout(query,options.timeout);
        }
    });

    if (options.logger.log){
        FS.exists(options.logger.log,function(){
            logger();
        });
    }
    return;
}
function logger(){
    /**
     * async read of log file
     * 
     * @return void
     */

    var options = GLOBAL._options.logger;
    var size = FS.statSync(options.log).size;
    var input = FS.createReadStream(options.log,{
        flags: 'r',
        mode: 444,
        encoding: 'utf-8',
        start: log.size,
        fd: null,
    });
    var stream = READLINE.createInterface({
        input: input,
        output: null,
        terminal: false,
    });

    if (log.size < size){
        log.size = size;
        event = {};
        stream.on('line',function(lines){
            /**
             * read one line for once
             * 
             * @param string line: line from log file
             */

            log.counter++;
            var line = JSON.parse(lines);
            // builder
            try{
                event[line.url][line.method][line.status].counter++;
            } catch (TypeError){
                if (event[line.url] == undefined){
                    event[line.url] = {};
                }
                if (event[line.url][line.method] == undefined){
                    event[line.url][line.method] = {};
                }
                if (event[line.url][line.method][line.status] == undefined){
                    event[line.url][line.method][line.status] = {
                        counter: 1,
                    };
                }
            }

            return;
        });
    } else{
        // clear
        event = {};
    }
    return;
}
function auth(req,res,next){
    /**
     * protection middleware
     * 
     * @param object req: request
     * @param object res: response
     * @param object next: continue routes
     * @return void
     */

    var options = GLOBAL._options.http;
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

    res.sendfile(__dirname + '/console/index.html');
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
    var options = GLOBAL._options.logger;

    var load = OS.loadavg();
    var free = OS.freemem();
    var v8 = process.memoryUsage();
    var cpus = OS.cpus();
    for ( var i in cpus){ // slim json
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
            total: OS.totalmem(),
            used: OS.totalmem() - free,
            v8: {
                rss: v8.rss,
                total: v8.heapTotal,
                used: v8.heapUsed,
            },
        },
        log: log,
        event: event,
    };

    var diff = process.hrtime(start);
    dynamics.ns = diff[0] * 1e9 + diff[1];
    res.json(dynamics);

    if (options.log){
        FS.exists(options.log,function(){
            logger();
        });
    }
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
module.exports = monitode;
if (!module.parent){
    // if standalone testing
    monitode({
        output: true,
    });
}
