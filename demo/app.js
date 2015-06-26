angular.module('myApp', ['ng.zl']).controller('DemoController', function ($scope, $timeout, ZLService) {

    'use strict';

    $scope.onAlert = function (event) {
        ZLService.alert('asdf', 'asdf', event).then(function () {
            window.console.log('after alert');
        });
    };

    $scope.onConfirm = function (event) {
        ZLService.confirm('a', 'bbbb', event).then(function () {
            window.console.log('after confirm ok');
        }, function () {
            window.console.log('after confirm cancel');
        });
    };

    var num = 1;
    $scope.onToast = function () {
        num ++;
        ZLService.tips('1111 ' + num).then(function () {
            window.console.log('after toast');
        });
    };

    $scope.onProgressStart = function () {
        ZLService.progress.start();
    };

    $scope.onProgressDone = function () {
        ZLService.progress.done();
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