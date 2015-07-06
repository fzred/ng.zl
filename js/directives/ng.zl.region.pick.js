angular.module('ng.zl.pick').directive('zlRegionPick', function () {
    'use strict';

    return {
        restrict: 'A',
        replace: true,
        scope: {
            config: '='
        },
        templateUrl: 'views/region.pick.html',
        controller: function ($scope, $attrs) {

            $scope.config = $.extend({
                chips: false,
                disable: false,
                model: null,
                getData: function(){},
                label: 'pick'
            }, $scope.config);

            $scope.querySearch = function (searchText) {
                return $scope.config.getData(searchText).then(function (data) {
                    if ($scope.config.chips) {
                        return _.filter(data, function (value) {
                            return !isExist(value, $scope.config.model);
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
