/*
 * monitode v2.4.5
 * (c) hex7c0 https://hex7c0.github.io/monitode/
 * Licensed under GPLv3
 */
"use strict";try{var OS=require("os"),SITEMAP=require("express-sitemap")()}catch(MODULE_NOT_FOUND){console.error(MODULE_NOT_FOUND),process.exit(1)}module.exports.dynamics=function(a){var b=OS.loadavg(),c=OS.totalmem();if(Boolean(a))return{uptime:{os:OS.uptime(),node:process.uptime()},cpu:{one:b[0],five:b[1],fifteen:b[2]},mem:{total:c,used:c-OS.freemem()}};for(var d=process.memoryUsage(),e=OS.cpus(),f=0,g=e.length;g>f;f++)e[f].model="";var h={date:Date.now(),ns:process.hrtime(),uptime:{os:OS.uptime(),node:process.uptime()},cpu:{one:b[0],five:b[1],fifteen:b[2],cpus:e},mem:{total:c,used:c-OS.freemem(),v8:{rss:d.rss,total:d.heapTotal,used:d.heapUsed}}};return GLOBAL.tickle&&(h.tickle=GLOBAL.tickle.route),h},module.exports.statics=function(a){var b={os:{hostname:OS.hostname(),platform:OS.platform(),arch:OS.arch(),type:OS.type(),release:OS.release()},version:process.versions,process:{gid:process.getgid(),uid:process.getuid(),pid:process.pid,env:process.env},network:OS.networkInterfaces(),endianness:OS.endianness()};return"object"==typeof a&&(b.route=SITEMAP.generate(a),SITEMAP.reset()),b};
