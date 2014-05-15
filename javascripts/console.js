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
    /**
     * onload function
     */

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
            height : 250,
        },
    });
    return;
}
function dyna($http, $scope, $timeout) {
    /**
     * ajax post 'dynamic'
     */

    function loop() {

        // avg
        store.x.push(new Date().toUTCString());
        store.one.push(Math.random());
        store.five.push(Math.random());
        store.fifteen.push(Math.random());
        // mem
        var testing = 1073741824;
        store.total.push(testing);
        store.used.push(testing / 4);
        store.free.push(testing - (testing / 4));
        store.v8rss.push(testing / 6);
        store.v8total.push(testing / 8);
        store.v8used.push(testing / 10);
        store.v8free.push((testing / 8) - (testing / 10));
        // chart
        avg.load({
            columns : [ store.x, store.one, store.five, store.fifteen ],
        });
        meml.load({
            columns : [ store.x, store.total, store.used, store.v8rss,
                    store.v8total, store.v8used, ],
        });
        memp.load({
            columns : [ [ 'used', testing / 4 ],
                    [ 'free', testing - (testing / 4) ] ],
        });
        // info
        $scope.dynamics = [ {
            title : 'System lag',
            info : Math.random() + ' nanoseconds,'
        }, {
            title : 'System uptime',
            info : 0 + ' minute',
        }, ];
        dyna($http, $scope, $timeout)

    }
    if ($scope.clock > 0) {
        $timeout(loop, $scope.clock);
    }
    return;
}
function stat($http, $scope) {
    /**
     * ajax post 'static'
     */

    // info
    $scope.statics = [ {
        title : 'OS hostname',
        info : 'testing page'
    }, {
        title : 'OS platform',
        info : 'testing page'
    }, {
        title : 'CPU architecture',
        info : 'testing page'
    }, {
        title : 'OS type',
        info : 'testing page'
    }, {
        title : 'OS release',
        info : 'testing page'
    }, {
        title : 'Node version',
        info : 'testing page'
    }, {
        title : 'Module versions',
        info : 'testing page'
    }, {
        title : 'Process gid',
        info : 'testing page'
    }, {
        title : 'Process uid',
        info : 'testing page'
    }, {
        title : 'Process pid',
        info : 'testing page'
    }, ];
    return;
}
// init
load();
app.controller('static', function($scope, $http, $timeout) {
    $scope.data = {};
    $scope.clock = 1;
    stat($http, $scope);
    dyna($http, $scope, $timeout);
    $scope.clock = clock;
    // click
    $scope.data.refresh = function(item, event) {
        if (item == 'dynamic') {
            dyna($http, $scope, $timeout);
        } else if (item == 'static') {
            stat($http, $scope);
        }
    };
});
