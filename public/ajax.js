"use strict";
/*
 * monitode 2.2.5 (c) 2014 hex7c0, https://hex7c0.github.io/monitode/
 * 
 * License: GPLv3
 */

/*
 * variables
 */
var promise = null, flag = false;

/*
 * functions
 */
/**
 * ajax post 'dynamic'
 * 
 * @function dyna
 * @param {Object} http - angular http object
 * @param {Object} scope - angular scope object
 * @param {Object} timeout - angular timeout object
 * @return
 */
function dyna($http,$scope,$timeout) {

    $timeout.cancel(promise);
    if ($scope.clock > 0) {
        promise = $timeout(loop,$scope.clock * 1000);
    } else if ($scope.clock == 0) {
        $scope.clock = 5;
        loop();
    }

    /**
     * ajax POST loop
     * 
     * @function loop
     * @return
     */
    function loop() {

        $http({
            method: 'POST',
            url: '/dyn/'
        }).success(
                function(data,status,headers,config) {

                    // avg
                    store.x.push(new Date(data.date));
                    store.one.push(data.cpu.one);
                    store.five.push(data.cpu.five);
                    store.fifteen.push(data.cpu.fifteen);
                    // mem
                    store.total.push(data.mem.total / 1024);
                    store.used.push(data.mem.used / 1024);
                    var mfree = data.mem.total - data.mem.used;
                    store.v8rss.push(data.mem.v8.rss / 1024);
                    store.v8total.push(data.mem.v8.total / 1024);
                    store.v8used.push(data.mem.v8.used / 1024);
                    // chart
                    avg.load({
                        columns: [store.x,store.one,store.five,store.fifteen],
                    });
                    meml.load({
                        columns: [store.x,store.total,store.used,store.v8rss,store.v8total,
                                store.v8used,],
                    });
                    memp.load({
                        columns: [['used',data.mem.used],['free',mfree]],
                    });
                    if (data.net) {
                        // os
                        store.inet.push(data.net.inn.pacs);
                        store.onet.push(data.net.out.pacs);
                        store.tps.push(data.io.tps);
                        store.mbs.push(data.io.mbs);
                        if (!os) {
                            loadOs();
                        }
                        os.load({
                            columns: [store.x,store.inet,store.onet,store.tps,store.mbs],
                        });
                    }
                    // cpu
                    if (cpus.length == 0) {
                        $scope.cpus = cpus = data.cpu.cpus;
                        loadProc($scope.cpus);
                    } else {
                        for (var i = 0, il = data.cpu.cpus.length; i < il; i++) {
                            var cpu = data.cpu.cpus[i];
                            cpus[i].load({
                                columns: [['user',cpu.times.user],['nice',cpu.times.nice],
                                        ['sys',cpu.times.sys],['idle',cpu.times.idle],
                                        ['irq',cpu.times.irq]],
                            });
                        }
                    }
                    /*
                     * info dynamics
                     */
                    $scope.dynamics = [{
                        title: 'Ajax lag',
                        info: (Date.now() - data.date) + ' milliseconds',
                    },{
                        title: 'System lag',
                        info: data.ns / 1000000 + ' milliseconds',
                    },{
                        title: 'System uptime',
                        info: Math.floor(data.uptime.os / 60) + ' minutes',
                    },{
                        title: 'System uptime Node',
                        info: Math.floor(data.uptime.node / 60) + ' minutes',
                    },];
                    /*
                     * info refresh
                     */
                    $scope.refresh = [];
                    // 0 logger
                    var temp = {
                        title: 'Logger',
                        child: [],
                    };
                    var temps = [];
                    for ( var property in data.log) {
                        temps.push({
                            title: property,
                            info: data.log[property],
                        });
                    }
                    try {
                        if (data.log.counter) {
                            temp['child'] = temps;
                        } else {
                            temp['info'] = 'disabled';
                        }
                        $scope.refresh[0] = temp;
                    } catch (TypeError) {
                        // pass
                    }
                    // 1 logger
                    if (data.event) {
                        var temp = {
                            title: 'Logger story event',
                            child: [],
                        };
                        var temps = store.logger;
                        for ( var property0 in data.event) { // url
                            flag = true;
                            var arr0 = data.event[property0];
                            for ( var property1 in arr0) { // method
                                var arr1 = arr0[property1];
                                for ( var property2 in arr1) { // status
                                    var arr2 = arr1[property2];
                                    temps.push({
                                        title: property0,
                                        info: property1 + ' ' + property2 + ' * ' + arr2.counter,
                                    });
                                }
                            }
                        }
                        if (flag) {
                            temp['child'] = temps;
                            $scope.refresh[1] = temp;
                        }
                    }
                    return dyna($http,$scope,$timeout);
                }).error(function(data,status,headers,config) {

            alert('server doesn\'t respond');
        });
    }
    return;

}
/**
 * ajax post 'static'
 * 
 * @function stat
 * @param {Object} http - angular http object
 * @param {Object} scope - angular scope object
 * @return
 */
function stat($http,$scope) {

    $http({
        method: 'POST',
        url: '/sta/'
    }).success(function(data,status,headers,config) {

        // info
        $scope.statics = [{
            title: 'CPU architecture',
            info: data.os.arch
        },{
            title: 'OS hostname',
            info: data.os.hostname
        },{
            title: 'OS platform',
            info: data.os.platform
        },{
            title: 'OS type',
            info: data.os.type
        },{
            title: 'OS release',
            info: data.os.release
        },{
            title: 'Process gid',
            info: data.process.gid
        },{
            title: 'Process uid',
            info: data.process.uid
        },{
            title: 'Process pid',
            info: data.process.pid
        },];
        // 0 environment
        var temp = {
            title: 'Process environment',
        };
        var temps = [];
        for ( var property in data.process.env) {
            temps.push({
                title: property,
                info: data.process.env[property],
            });
        }
        temp['child'] = temps;
        $scope.statics.push(temp);
        // 1 interfaces
        var temp = {
            title: 'Network interfaces',
        };
        var temps = [];
        for ( var property in data.network) {
            for ( var inside in data.network[property]) {
                var obj = data.network[property][inside];
                if (!obj.internal) { // skip loopback
                    temps.push({
                        title: property + ' (' + obj.family + ')',
                        info: obj.address,
                    });
                }
            }
        }
        temp['child'] = temps;
        $scope.statics.push(temp);
        // 2 version
        var temp = {
            title: 'Node version',
        };
        var temps = [];
        for ( var property in data.version) {
            temps.push({
                title: property,
                info: data.version[property],
            });
        }
        temp['child'] = temps;
        $scope.statics.push(temp);
    }).error(function(data,status,headers,config) {

        // pass
    });
    return;

}
