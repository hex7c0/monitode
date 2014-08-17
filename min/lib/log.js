/*
 * monitode v2.4.14
 * (c) hex7c0 https://hex7c0.github.io/monitode/
 * Licensed under GPLv3
 */
"use strict";function logger(a){var b=GLOBAL.monitode.event=Object.create(null),c=GLOBAL.monitode.log,d=FS.statSync(a).size,e=STARTLINE({file:a,flags:"r",mode:444,encoding:"utf8",start:c.size});if(c.size<d){c.size=d;var f=function(a){var d=Object.create(null);try{d=JSON.parse(a)}catch(e){return}c.counter++;try{b[d.url][d.method][d.status].counter++}catch(f){void 0==b[d.url]&&(b[d.url]=Object.create(null)),void 0==b[d.url][d.method]&&(b[d.url][d.method]=Object.create(null)),void 0==b[d.url][d.method][d.status]&&(b[d.url][d.method][d.status]={counter:1})}};e.on("line",f)}}try{var FS=require("fs"),STARTLINE=require("startline")}catch(MODULE_NOT_FOUND){console.error(MODULE_NOT_FOUND),process.exit(1)}module.exports=function(a){FS.exists(a,function(b){b&&logger(a)})};
