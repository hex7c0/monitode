/*
 * monitode v2.4.11
 * (c) hex7c0 https://hex7c0.github.io/monitode/
 * Licensed under GPLv3
 */
"use strict";try{var MAIL=require("nodemailer")}catch(MODULE_NOT_FOUND){console.error(MODULE_NOT_FOUND),process.exit(1)}module.exports=function(){function a(){clearTimeout(b);var g=require(e.min+"lib/obj.js").dynamics(!0);c&&(g.net=e.net,g.io=e.io,d&&(c(),d())),f.to.text=JSON.stringify(g),f.provider.sendMail(f.to,function(c){c?console.error(c):b=setTimeout(a,f.timeout),f.provider.close()})}var b,c,d,e=GLOBAL.monitode,f=e.mail;return e.os&&(e.monitor.os?(e.monitor.os=!1,c=require(e.min+"lib/net.js")(),d=require(e.min+"lib/io.js")()):c=!0),f.provider=MAIL.createTransport({service:f.provider,auth:{user:f.user,pass:f.password}}),f.to={from:f.user,to:f.to.toString(),subject:f.subject},GLOBAL.monitode.mail.user=GLOBAL.monitode.mail.password=!0,e.output&&console.log("starting monitor with email"),a()};
