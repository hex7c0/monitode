/*
 * monitode v2.4.0
 * (c) hex7c0 https://hex7c0.github.io/monitode/
 * Licensed under GPLv3
 */
"use strict";try{var LOGGER=require("logger-request")}catch(MODULE_NOT_FOUND){console.error(MODULE_NOT_FOUND),process.exit(1)}module.exports=function(){function a(){clearTimeout(b),d.file("moniFile",require(c.min+"lib/obj.js").dynamics(!0)),b=setTimeout(a,d.timeout)}var b,c=GLOBAL.monitode,d=c.logger;return c.output&&console.log("starting monitor on file "+d.file),d.file=LOGGER({standalone:!0,filename:d.file,winston:{logger:"moniFile",level:"debug",maxsize:null,json:!1}}),a()};