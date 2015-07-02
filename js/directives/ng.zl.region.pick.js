angular.module('ng.zl.pick').directive('zlRegionPick', function (ZlPickService) {
    'use strict';

    // 有点复杂，不写注释了

    return {
        restrict: 'A',
        replace: true,
        scope: {
            regionParent: '=',
            ngModel: '=',
            pickChips: '='
        },
        templateUrl: 'views/region.pick.html',
        controller: function ($scope, $attrs) {
            var api = '';

            $scope.pickChips = $scope.pickChips || false;

            $scope.needRegionParent = $attrs.regionParent !== undefined;
            $scope.name = $attrs.zlRegionPick;

            if ($scope.name === 'province') {
                api = 'getProvinceByWord';
            } else if ($scope.name === 'city') {
                api = 'getCityByWord';
            } else if ($scope.name === 'area') {
                api = 'getAreaByWord';
            }

            $scope.searchText = null;
            $scope.selectedItem = null;
            $scope.querySearch = function (searchText) {
                return ZlPickService[api]({
                    parentId: $scope.regionParent && $scope.regionParent.id || null,
                    keyword: searchText
                }).then(function (data) {
                    if ($scope.pickChips) {
                        return _.filter(data, function (value) {
                            return !isExist(value, $scope.ngModel);
                        });
                    }
                    return data;
                });
            };

            function isExist(item, items) {
                var result = false;
                _.each(items, function (value) {
                    if (value.id === item.id) {
                        result = true;
                    }
                });
                return result;
            }
        }
    };
});
