angular.module('myApp', ['ng.zl', 'ng.zl.grid', 'ng.zl.uploader', 'ng.zl.pick']).controller('DemoController', function ($scope, $zlUploader, $zl) {
    'use strict';

    $zlUploader.imgUpload($('#uploadFile'), {
        uploadScript: '/admin/address/importAddressInfos',
        onUploadComplete: function (file, data) {
            data = angular.fromJson(data);
            if (data.errorCode === 200) {
                $scope.$apply(function () {
                    $zl.tips('上传成功');
                });
            } else {
                $scope.$apply(function () {
                    $zl.tips(data.errorDescription || '未知错误');
                });
            }
        }
    });



    $scope.province = null;
    $scope.city = null;
    $scope.area = null;

    $scope.citys = [];

    $scope.community = null;
    $scope.communitys = [];

    $scope.building = null;
    $scope.buildings = [];

    $scope.apartment = null;
    $scope.apartments = [];

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

    $scope.onPrompt = function (event) {
        $zl.prompt('a', 'bbbb', event).then(function (word) {
            window.console.log('after prompt ok' + word);
        }, function () {
            window.console.log('after prompt cancel');
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
}).controller('GridController', function ($scope, $q, $timeout) {
    'use strict';

    $scope.gridData = {
        enableSelect: true,
        columns: [
            {field: 'id', name: 'id', render: renderId},
            {field: 'name', name: '名字', edit: true, editType: 'input', afterEdit: afterEdit},
            {
                field: 'gender',
                name: '性别',
                edit: true,
                editType: 'select',
                editData: editData,
                afterEdit: afterEditGender
            },
            {field: 'isOk', name: '是否', edit: true, editType: 'switch', afterEdit: afterEditOk}
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

    $timeout(function () {
        $scope.gridData.watchReload = true;
    }, 2000);

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
        return '<input ng-model="data[col.field]" />';
    }

    function afterEditOk(data) {
        console.log(data);
    }

    function afterEditGender(data) {
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
                gender: 1,
                isOk: false
            }, {
                id: 1,
                name: 'haha',
                gender: 1,
                isOk: true
            }, {
                id: 1,
                name: 'haha',
                gender: 1,
                isOk: false
            }, {
                id: 1,
                name: 'haha',
                gender: 1,
                isOk: false
            }]
        });
        return def.promise;
    }
});