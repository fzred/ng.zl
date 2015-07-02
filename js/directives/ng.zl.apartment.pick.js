angular.module('ng.zl.pick').directive('zlApartmentPick', function (ZlPickService) {
    'use strict';

    // 有点复杂，不写注释了

    return {
        restrict: 'A',
        replace: true,
        scope: {
            pickCommunityId: '=',
            pickBuildingName: '=',
            ngModel: '=',
            pickChips: '='
        },
        templateUrl: 'views/apartment.pick.html',
        controller: function ($scope) {
            $scope.pickChips = $scope.pickChips || false;

            $scope.searchText = null;
            $scope.selectedItem = null;

            $scope.querySearch = function (searchText) {
                return ZlPickService.getApartmentByWord({
                    buildingName: $scope.pickBuildingName,
                    communityId: $scope.pickCommunityId,
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
                    if (value.addressId === item.addressId) {
                        result = true;
                    }
                });
                return result;
            }
        }
    };
});
