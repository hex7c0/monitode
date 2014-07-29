"use strict";
/*
 * monitode 2.3.0 (c) 2014 hex7c0, https://hex7c0.github.io/monitode/
 * 
 * License: GPLv3
 */

/*
 * variables
 */
var avg, meml, memp, os;
var cpus = [], app = angular.module('monitode',[]);
var store = {
    x: ['x'],
    one: ['one'],
    five: ['five'],
    fifteen: ['fifteen'],
    total: ['total'],
    used: ['used'],
    v8rss: ['v8rss'],
    v8total: ['v8total'],
    v8used: ['v8used'],
    inet: ['inet'],
    onet: ['onet'],
    tps: ['tps'],
    mbs: ['mbs'],
    logger: [],
};

/*
 * functions
 */
/**
 * onload function
 * 
 * @function load
 * @return
 */
function load() {

    avg = c3.generate({
        bindto: '#average',
        data: {
            type: 'line',
            x: 'x',
            columns: [store.x,store.one,store.five,store.fifteen],
            names: {
                one: 'average in 1 min',
                five: 'average in 5 min',
                fifteen: 'average in 15 min',
            },
            colors: {
                one: '#107aff',
                five: '#00a855',
                fifteen: '#ff9900',
            },
        },
        size: {
            height: 400,
        },
        grid: {
            y: {
                lines: [{
                    value: 1,
                    text: 'overload',
                },],
            },
        },
        axis: {
            x: {
                type: 'timeseries',
                label: 'time',
                localtime: false,
                tick: {
                    count: 5,
                    format: '/%d %H:%M:%S',
                },
            },
            y: {
                label: 'load average',
                tick: {
                    format: d3.format(','),
                },
            }
        },
    });
    meml = c3.generate({
        bindto: '#memory_lin',
        data: {
            type: 'bar',
            types: {
                total: 'area',
                used: 'spline',
                v8total: 'line',
            },
            groups: [['v8rss','v8used']],
            x: 'x',
            columns: [store.x,store.total,store.used,store.v8rss,store.v8total,
                    store.v8used],
            names: {
                total: 'total memory',
                used: 'memory used',
            // v8rss: 'V8 rss', //too long, BUGGED
            // v8total: 'V8 total memory',
            // v8used: 'V8 memory used',
            },
            colors: {
                used: 'red',
                total: 'gray',
            },
        },
        size: {
            height: 400,
        },
        axis: {
            x: {
                type: 'timeseries',
                label: 'time',
                localtime: false,
                tick: {
                    count: 5,
                    format: '/%d %H:%M:%S',
                },
            },
            y: {
                label: 'kilobytes',
            }
        },
    });
    memp = c3.generate({
        bindto: '#memory_pie',
        data: {
            type: 'pie',
            columns: [['used',0],['free',100]],
            names: {
                used: 'memory used',
                free: 'memory free',
            },
            colors: {
                used: 'red',
                free: 'orange',
            },
        },
        size: {
            height: 250,
        },
    });
    return;
}

/**
 * chart init for cpus
 * 
 * @function loadProc
 * @param {Array} cpu - info about cpus
 * @return
 */
function loadProc(cpu) {

    var buff = cpu;
    for (var i = 0; i < buff.length; i++) {
        cpus[i] = c3.generate({
            bindto: '#cpu_' + i,
            data: {
                type: 'donut',
                columns: [['user',buff[i].times.user],
                        ['nice',buff[i].times.nice],['sys',buff[i].times.sys],
                        ['idle',buff[i].times.idle],['irq',buff[i].times.irq]],
                colors: {
                    user: '#107aff',
                    idle: '#00a855',
                    sys: '#ff9900',
                },
            },
            donut: {
                title: 'CPU ' + (i + 1),
            },
            legend: {
                show: false
            },
            size: {
                height: 280,
                width: 280,
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        });
    }
    return;
}

/**
 * chart init for net/io
 * 
 * @function loadOs
 * @return
 */
function loadOs() {

    os = c3.generate({
        bindto: '#os',
        data: {
            type: 'spline',
            x: 'x',
            columns: [store.x,store.inet,store.onet,store.tps,store.mbs],
            names: {
                inet: 'input packets',
                onet: 'output packets',
                tps: 'transfers/s',
                mbs: 'MB/s',
            },
            colors: {
                inet: 'red',
                onet: 'blue',
                tps: 'green',
                mbs: 'purple',
            },
        },
        axis: {
            x: {
                type: 'timeseries',
                label: 'time',
                localtime: false,
                tick: {
                    count: 5,
                    format: '/%d %H:%M:%S',
                },
            },
        },
    });
    return;
}

/**
 * controller of angular
 * 
 * @function controller
 * @param {Object} http - angular http object
 * @param {Object} scope - angular scope object
 * @param {Object} timeout - angular timeout object
 * @return
 */
function controller($scope,$http,$timeout) {

    $scope.clock = 0;
    dyna($http,$scope,$timeout);
    stat($http,$scope);
    // click
    $scope.button = function(item,event) {

        switch (item){
            case 'dynamic':
                dyna($http,$scope,$timeout);
            break;
            case 'static':
                stat($http,$scope);
            break;
            case 'stop':
                $timeout.cancel(promise);
            break;
            case 'csv':
                var content = ('data:text/csv;charset=utf-8,');
                content += 'date,average 1 min,average 5 min,average 15 min,memory used\n';
                for (var i = 1; i < store.x.length; i++) {
                    content += store.x[i] + ',';
                    content += store.one[i] + ',';
                    content += store.five[i] + ',';
                    content += store.fifteen[i] + ',';
                    content += store.used[i] + '\n';
                }
                window.open(encodeURI(content));
            break;
            case 'clear':
                var len = store.x.length;
                for ( var property in store) {
                    store[property].splice(1,len);
                }
                store.logger = [];
            break;
        }
    };
    return;
}

/*
 * start
 */
load();
app.controller('main',controller);
