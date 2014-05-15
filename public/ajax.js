var promise = null;
function dyna($http, $scope, $timeout) {
    /**
     * ajax post 'dynamic'
     */

    $timeout.cancel(promise);

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
                        info : Math.floor(data.uptime / 60) + ' minute',
                    }, ];
                    dyna($http, $scope, $timeout)
                }).error(function(data, status, headers, config) {
            alert('server donesn\'t respond');
        });
    }
    if ($scope.clock > 0) {
        promise = $timeout(loop, $scope.clock * 1000);
    }
    return;
}
function stat($http, $scope) {
    /**
     * ajax post 'static'
     */

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
