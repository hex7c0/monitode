var promise = null;
function dyna($http, $scope, $timeout) {
    /**
     * ajax post 'dynamic'
     */

    $timeout.cancel(promise);

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
        [ {
            title : 'Ajax lag',
            info : (Date.now() - data.date) + ' milliseconds',
        }, {
            title : 'System lag',
            info : Math.random() + ' nanoseconds',
        }, {
            title : 'System uptime',
            info : 0 + ' minutes',
        }, ];
        dyna($http, $scope, $timeout)

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

    // info
    $scope.statics = [ {
        title : 'CPU architecture',
        info : 'testing page'
    }, {
        title : 'OS hostname',
        info : 'testing page'
    }, {
        title : 'OS platform',
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
