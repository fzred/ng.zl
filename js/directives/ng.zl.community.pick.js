angular.module('ng.zl.pick', 'ng.zl').directive('zlCommunityPick', function (DataService) {
    'use strict';

    // 有点复杂，不写注释了

    return {
        restrict: 'A',
        replace: true,
        scope: {
            pickCityId: '=',
            ngModel: '=',
            pickChips: '='
        },
        templateUrl: 'views/community.pick.html',
        controller: function ($scope) {
            $scope.pickChips = $scope.pickChips || false;

            $scope.searchText = null;
            $scope.selectedItem = null;

            $scope.querySearch = function (searchText) {
                return DataService.getCommunityByWord({
                    cityId: $scope.pickCityId,
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
