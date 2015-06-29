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
}).controller('GridController', function ($scope, $q, $zl) {
    'use strict';

    $scope.gridData = {
        enableSelect: true,
        columns: [
            {field: 'id', name: 'id', render: renderId},
            {field: 'name', name: '名字', edit: true, editType: 'input', afterEdit: afterEdit},
            {field: 'gender', name: '性别', edit: true, editType: 'select', editData: editData, afterEdit: afterEditGender}
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

    $scope.editData = editData;
    $scope.select = null;

    function editData() {
        var def = $q.defer();
        def.resolve([{
            value: 1,
            name: '男'
        }, {
            value: 2,
            name: '女'
        }]);
        return def.promise;
        //return [{
        //    value: 1,
        //    name: '男'
        //}, {
        //    value: 2,
        //    name: '女'
        //}];
    }

    function renderId(value) {
        return $zl.format('<a>{value}</a>', {value: value});
    }

    function afterEditGender(data){
        console.log(data);
    }

    function afterEdit(data) {
        console.log(data);
        var def = $q.defer();
        def.resolve();
        return def.promise;
    }

    function onDel() {

    }


    function getData() {
        var def = $q.defer();
        def.resolve({
            values: [{
                id: 1,
                name: '1123',
                gender: 1
            }, {
                id: 1,
                name: 'haha',
                gender: 1
            }, {
                id: 1,
                name: 'haha',
                gender: 1
            }, {
                id: 1,
                name: 'haha',
                gender: 1
            }]
        });
        return def.promise;
    }
});