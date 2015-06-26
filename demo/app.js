angular.module('myApp', ['ng.zl', 'ng.zl.grid']).controller('DemoController', function ($scope) {
    'use strict';
}).controller('DialogController', function ($scope, $timeout, $zl) {

    'use strict';

    $scope.onAlert = function (event) {
        $zl.alert('asdf', 'asdf', event).then(function () {
            window.console.log('after alert');
        });
    };

    $scope.onConfirm = function (event) {
        $zl.confirm('a', 'bbbb', event).then(function () {
            window.console.log('after confirm ok');
        }, function () {
            window.console.log('after confirm cancel');
        });
    };

    var num = 1;
    $scope.onToast = function () {
        num++;
        $zl.tips('1111 ' + num).then(function () {
            window.console.log('after toast');
        });
    };

    $scope.onProgressStart = function () {
        $zl.progress.start();
    };

    $scope.onProgressDone = function () {
        $zl.progress.done();
    };
}).controller('GridController', function ($scope, $q) {
    'use strict';

    $scope.gridData = {
        columns: [
            {field: 'id', name: 'id'},
            {field: 'name', name: '名字', edit: true, afterEdit: afterEdit}
        ],
        actions: [{
            type: 'btn',
            html: '删除',
            action: onDel
        }],
        getData: function () {
            return getData();
        }
    };

    function afterEdit() {

    }

    function onDel() {

    }


    function getData() {
        var def = $q.defer();
        def.resolve({
            values: [{
                id: 1,
                name: 'haha'
            }, {
                id: 1,
                name: 'haha'
            }, {
                id: 1,
                name: 'haha'
            }, {
                id: 1,
                name: 'haha'
            }, {
                id: 1,
                name: 'haha'
            }, {
                id: 1,
                name: 'haha'
            }, {
                id: 1,
                name: 'haha'
            }]
        });
        return def.promise;
    }
});