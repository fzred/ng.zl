angular.module('myApp', ['ng.zl']).controller('DemoController', function ($scope, $timeout, $zl) {

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
        num ++;
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
});
//myModule.controller('DemoSubController', function ($scope) {
//    'use strict';
//
//    $scope.province = null;
//    $scope.city = null;
//    $scope.area = null;
//
//    $scope.community = null;
//    $scope.communitys = [];
//
//    $scope.building = null;
//    $scope.buildings = [];
//
//    $scope.apartment = null;
//    $scope.apartments = [];
//
//});