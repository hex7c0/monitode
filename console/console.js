"use strict";
// variables
var clock = 2000;
var avg = null;
var meml = null;
var memp = null;
var app = angular.module('monitode', []);
var store = {
    x : [ 'x' ],
    one : [ 'one' ],
    five : [ 'five' ],
    fifteen : [ 'fifteen' ],
    total : [ 'total' ],
    used : [ 'used' ],
    free : [ 'free' ],
    v8rss : [ 'v8rss' ],
    v8total : [ 'v8total' ],
    v8used : [ 'v8used' ],
    v8free : [ 'v8free' ],
};
// functions
function load() {
    avg = c3.generate({
        bindto : '#average',
        data : {
            type : 'line',
            x : 'x',
            columns : [ store.x, store.one, store.five, store.fifteen ],
            names : {
                one : 'average in 1 min',
                five : 'average in 5 min',
                fifteen : 'average in 15 min',
            },
            colors : {
                one : '#107aff',
                five : '#00a855',
                fifteen : '#ff9900',
            },
        },
        size : {
            height : 400,
        },
        grid : {
            y : {
                lines : [ {
                    value : 1,
                    text : 'overload',
                }, ],
            },
        },
        axis : {
            x : {
                type : 'timeseries',
                label : 'time',
                localtime : false,
                tick : {
                    format : '%d %H:%M:%S',
                },
            },
            y : {
                label : 'load average',
                tick : {
                    format : d3.format(','),
                },
            }
        },
    });
    meml = c3.generate({
        bindto : '#memory_lin',
        data : {
            type : 'bar',
            types : {
                total : 'area',
                used : 'spline',
                v8total : 'line',
            },
            groups : [ [ 'v8rss', 'v8used' ] ],
            x : 'x',
            columns : [ store.x, store.total, store.used, store.v8rss,
                    store.v8total, store.v8used ],
            names : {
                total : 'total memory',
                used : 'memory used',
                v8rss : 'V8 rss',
                v8total : 'V8 total memory',
                v8used : 'V8 memory used',
            },
            colors : {
                used : 'red',
                total : 'gray',
            },
        },
        size : {
            height : 400,
        },
        axis : {
            x : {
                type : 'timeseries',
                label : 'time',
                localtime : false,
                tick : {
                    format : '%d %H:%M:%S',
                },
            },
            y : {
                label : 'bytes',
            }
        },
    });
    memp = c3.generate({
        bindto : '#memory_pie',
        data : {
            type : 'pie',
            columns : [ [ 'used', 0 ], [ 'free', 100 ] ],
            names : {
                used : 'memory used',
                free : 'memory free',
            },
            colors : {
                used : 'red',
                free : 'orange',
            },
        },
        size : {
            height : 200,
        },
    });
}
function dyna($http, $scope, $timeout) {

    function loop() {
        $http({
            method : 'POST',
            url : '/dyn/'
        }).success(
                function(data, status, headers, config) {
                    // avg
                    store.x.push(new Date(data.date).toUTCString());
                    store.one.push(data.cpu.one);
                    store.five.push(data.cpu.five);
                    store.fifteen.push(data.cpu.fifteen);
                    // mem
                    store.total.push(data.mem.total);
                    store.used.push(data.mem.used);
                    store.free.push(data.mem.free);
                    store.v8rss.push(data.mem.v8.rss);
                    store.v8total.push(data.mem.v8.total);
                    store.v8used.push(data.mem.v8.used);
                    store.v8free.push(data.mem.v8.free);
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
                                [ 'free', data.mem.free ] ],
                    });
                    // info
                    $scope.dynamics = [ {
                        title : 'System lag',
                        info : data.ns + ' nanoseconds,'
                    }, {
                        title : 'System uptime',
                        info : (data.uptime / 60) + ' minute',
                    }, ];
                    dyna($http, $scope, $timeout)
                }).error(function(data, status, headers, config) {
            alert('server donesn\'t respond');
        });
    }
    if ($scope.clock > 0) {
        $timeout(loop, $scope.clock);
    }
    return;
}
function stat($http, $scope) {
    $http({
        method : 'POST',
        url : '/sta/'
    }).success(function(data, status, headers, config) {
        // info
        $scope.statics = [ {
            title : 'OS hostname',
            info : data.os.hostname
        }, {
            title : 'OS platform',
            info : data.os.platform
        }, {
            title : 'CPU architecture',
            info : data.os.arch
        }, {
            title : 'OS type',
            info : data.os.type
        }, {
            title : 'OS release',
            info : data.os.release
        }, {
            title : 'Node version',
            info : data.version.node
        }, {
            title : 'Module versions',
            info : data.version.module
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
    }).error(function(data, status, headers, config) {
        alert('server donesn\'t respond');
    });
    return;
}
// init
app.controller('static', function($scope, $http, $timeout) {
    $scope.data = {};
    $scope.clock = clock;
    dyna($http, $scope, $timeout);
    stat($http, $scope);
    // click
    $scope.data.refresh = function(item, event) {
        if (item == 'dynamic') {
            dyna($http, $scope, $timeout);
        } else if (item == 'static') {
            stat($http, $scope);
        }
    };
});
