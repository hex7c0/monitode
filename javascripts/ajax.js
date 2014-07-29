var promise;
function dyna($http,$scope,$timeout) {

    $timeout.cancel(promise);
    if ($scope.clock > 0) {
        promise = $timeout(loop,$scope.clock * 1000);
    } else if ($scope.clock == 0) {
        $scope.clock = 5;
        loop();
    }

    function loop() {

        // avg
        store.x.push(new Date());
        store.one.push(Math.random());
        store.five.push(Math.random());
        store.fifteen.push(Math.random());

        // mem
        var testing = 1073741824;
        store.total.push(testing);
        store.used.push(testing / 4);
        store.v8rss.push(testing / 6);
        store.v8total.push(testing / 8);
        store.v8used.push(testing / 10);

        // chart
        var X = store.x;
        avg.load({
            columns: [X,store.one,store.five,store.fifteen],
        });
        meml.load({
            columns: [X,store.total,store.used,store.v8rss,store.v8total,
                    store.v8used],
        });
        memp.load({
            columns: [['used',testing / 4],['free',testing - (testing / 4)]],
        });

        // cpu
        if (cpus.length == 0) {
            $scope.cpus = cpus = [{
                times: {
                    user: Math.random(),
                    nice: 0,
                    sys: Math.random(),
                    idle: Math.random(),
                    irq: 0
                }
            },{
                times: {
                    user: Math.random(),
                    nice: 0,
                    sys: Math.random(),
                    idle: Math.random(),
                    irq: 0
                }
            },{
                times: {
                    user: Math.random(),
                    nice: 0,
                    sys: Math.random(),
                    idle: Math.random(),
                    irq: 0
                }
            },{
                times: {
                    user: Math.random(),
                    nice: 0,
                    sys: Math.random(),
                    idle: Math.random(),
                    irq: 0
                }
            }];
            loadProc($scope.cpus);
        } else {
            for (var i = 0, xx = cpus.length; i < xx; i++) {
                cpus[i].load({
                    columns: [['user',Math.random()],['nice',0],
                            ['sys',Math.random()],['idle',Math.random()],
                            ['irq',0]],
                });
            }
        }

        $scope.dynamics = [{
            title: 'Ajax lag',
            info: 0 + ' milliseconds',
        },{
            title: 'System lag',
            info: Math.random() + ' nanoseconds',
        },{
            title: 'System uptime',
            info: 0 + ' minutes',
        },{
            title: 'System uptime Node',
            info: 0 + ' minutes',
        },];
        return dyna($http,$scope,$timeout)
    }

    return;
}

function stat($http,$scope) {

    // info
    $scope.statics = [{
        title: 'CPU architecture',
        info: 'testing page'
    },{
        title: 'OS hostname',
        info: 'testing page'
    },{
        title: 'OS platform',
        info: 'testing page'
    },{
        title: 'OS type',
        info: 'testing page'
    },{
        title: 'OS release',
        info: 'testing page'
    },{
        title: 'OS endianness',
        info: 'testing page'
    },{
        title: 'Process gid',
        info: 'testing page'
    },{
        title: 'Process uid',
        info: 'testing page'
    },{
        title: 'Process pid',
        info: 'testing page'
    },{
        title: 'Process environment',
        info: 'testing page'
    },{
        title: 'Network interfaces',
        info: 'testing page'
    },{
        title: 'Node versions',
        info: 'testing page'
    }];
    return;
}
