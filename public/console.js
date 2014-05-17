"use strict";
/*
 * monitode 1.0.5 (c) 2014 hex7c0, https://hex7c0.github.io/monitode/
 * License: GPLv3
 */
// variables
var avg = null;
var meml = null;
var memp = null;
var cpus = [];
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
     * 
     * @return void
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
                    count : 5,
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
                    count : 5,
                    format : '%d %H:%M:%S',
                },
            },
            y : {
                label : 'kilobytes',
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
function proc(cpu) {
    /**
     * chart init for cpus
     * 
     * @return void
     */

    var buff = cpu
    for (var i = 0; i < buff.length; i++) {
        cpus[i] = c3.generate({
            bindto : '#cpu_' + i,
            data : {
                type : 'donut',
                columns : [ [ 'user', buff[i].times.user ],
                        [ 'nice', buff[i].times.nice ],
                        [ 'sys', buff[i].times.sys ],
                        [ 'idle', buff[i].times.idel ],
                        [ 'irq', buff[i].times.irq ] ],
            },
            donut : {
                title : 'CPU ' + (i + 1),
            },
            legend : {
                show : false
            },
            size : {
                height : 280,
                width : 280,
            },
            padding : {
                top : 0,
                right : 0,
                bottom : 0,
                left : 0,
            },
        });
    }
    return;
}
// init
load();
app
        .controller(
                'main',
                function($scope, $http, $timeout) {
                    $scope.data = {};
                    $scope.clock = 0;
                    dyna($http, $scope, $timeout);
                    stat($http, $scope);
                    $scope.clock = 2;
                    // click
                    $scope.data.refresh = function(item, event) {
                        if (item == 'dynamic') {
                            dyna($http, $scope, $timeout);
                        } else if (item == 'static') {
                            stat($http, $scope);
                        } else if (item == 'stop') {
                            $timeout.cancel(promise);
                        } else if (item == 'csv') {
                            var name = new Date().getDay() + '_monitode.csv';
                            var content = ('data:text/csv;charset=utf-8,');
                            content += 'date,average 1 min,average 5 min,average 15 min,memory used,memory free\n';
                            for (var i = 1; i < store.x.length; i++) {
                                content += store.x[i] + ',' + store.one[i]
                                        + ',' + store.five[i] + ','
                                        + store.fifteen[i] + ','
                                        + store.used[i] + ',' + store.free[i]
                                        + '\n';
                            }
                            window.open(encodeURI(content));
                        }

                    };
                });
