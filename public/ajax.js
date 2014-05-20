"use strict";
/*
 * monitode 1.1.1 (c) 2014 hex7c0, https://hex7c0.github.io/monitode/
 * 
 * License: GPLv3
 */

// variables
var promise = null;
var flag = false;

// functions
function dyna($http, $scope, $timeout) {
    /**
     * ajax post 'dynamic'
     * 
     * @return void
     */

    $timeout.cancel(promise);
    if ($scope.clock > 0) {
        promise = $timeout(loop, $scope.clock * 1000);
    } else if ($scope.clock == 0) {
        $scope.clock = 5;
        loop();
    }

    function loop() {
        /**
         * ajax POST loop
         * 
         * @return boolean (callback)
         */

        $http({
            method : 'POST',
            url : '/dyn/'
        }).success(
                function(data, status, headers, config) {
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
                        columns : [ store.x, store.one, store.five,
                                store.fifteen ],
                    });
                    meml.load({
                        columns : [ store.x, store.total, store.used,
                                store.v8rss, store.v8total, store.v8used, ],
                    });
                    memp.load({
                        columns : [ [ 'used', data.mem.used ],
                                [ 'free', mfree ] ],
                    });
                    // cpu
                    if (cpus.length == 0) {
                        $scope.cpus = cpus = data.cpu.cpus;
                        proc($scope.cpus);
                    } else {
                        for (var i = 0; i < data.cpu.cpus.length; i++) {
                            var cpu = data.cpu.cpus[i];
                            cpus[i].load({
                                columns : [ [ 'user', cpu.times.user ],
                                        [ 'nice', cpu.times.nice ],
                                        [ 'sys', cpu.times.sys ],
                                        [ 'idle', cpu.times.idle ],
                                        [ 'irq', cpu.times.irq ] ],
                            });
                        }
                    }
                    /*
                     * info dynamics
                     */
                    $scope.dynamics = [ {
                        title : 'Ajax lag',
                        info : (Date.now() - data.date) + ' milliseconds',
                    }, {
                        title : 'System lag',
                        info : data.ns + ' nanoseconds',
                    }, {
                        title : 'System uptime',
                        info : Math.floor(data.uptimeS / 60) + ' minutes',
                    }, {
                        title : 'System uptime Node',
                        info : Math.floor(data.uptimeN / 60) + ' minutes',
                    }, ];
                    /*
                     * info refresh
                     */
                    $scope.refresh = [];
                    // 0 logger
                    var temp = {
                        title : 'Logger',
                        child : [],
                    };
                    var temps = [];
                    for ( var property in data.log) {
                        temps.push({
                            title : property,
                            info : data.log[property],
                        })
                    }
                    if (data.log.counter) {
                        temp['child'] = temps;
                    } else {
                        temp['info'] = 'disabled';
                    }
                    $scope.refresh[0] = temp;
                    // 1 logger
                    if (data.event) {
                        var temp = {
                            title : 'Logger story event',
                            child : [],
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
                                        title : property0 + ':',
                                        info : property1 + ' ' + property2
                                                + ' * ' + arr2.counter,
                                    })
                                }
                            }
                        }
                        if (flag) {
                            temp['child'] = temps
                            $scope.refresh.push(temp);
                        }
                    }

                    return dyna($http, $scope, $timeout);
                }).error(function(data, status, headers, config) {
            alert('server doesn\'t respond');
            return false;
        });
    }
    return;
}
function stat($http, $scope) {
    /**
     * ajax post 'static'
     * 
     * @return boolean (callback)
     */

    $http({
        method : 'POST',
        url : '/sta/'
    }).success(function(data, status, headers, config) {
        // info
        $scope.statics = [ {
            title : 'CPU architecture',
            info : data.os.arch
        }, {
            title : 'OS hostname',
            info : data.os.hostname
        }, {
            title : 'OS platform',
            info : data.os.platform
        }, {
            title : 'OS type',
            info : data.os.type
        }, {
            title : 'OS release',
            info : data.os.release
        }, {
            title : 'Process gid',
            info : data.process.gid
        }, {
            title : 'Process uid',
            info : data.process.uid
        }, {
            title : 'Process pid',
            info : data.process.pid
        }, ];
        // 0 environment
        var temp = {
            title : 'Process environment',
        };
        var temps = [];
        for ( var property in data.process.env) {
            temps.push({
                title : property,
                info : data.process.env[property],
            })
        }
        temp['child'] = temps;
        $scope.statics.push(temp);
        // 1 interfaces
        var temp = {
            title : 'Network interfaces',
        };
        var temps = [];
        for ( var property in data.network) {
            for ( var inside in data.network[property]) {
                var obj = data.network[property][inside]
                if (!obj.internal) { // skip loopback
                    temps.push({
                        title : property + ' (' + obj.family + ')',
                        info : obj.address,
                    })
                }
            }
        }
        temp['child'] = temps;
        $scope.statics.push(temp);
        // 2 version
        var temp = {
            title : 'Node version',
        };
        var temps = [];
        for ( var property in data.version) {
            temps.push({
                title : property,
                info : data.version[property],
            })
        }
        temp['child'] = temps;
        $scope.statics.push(temp);
        return true;
    }).error(function(data, status, headers, config) {
        return false;
    });
}
