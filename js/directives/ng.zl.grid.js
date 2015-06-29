angular.module('ng.zl.grid', ['ng.zl']).directive('zlGrid', function ($zl) {
    'use strict';

    return {
        restrict: 'A',
        replace: true,
        scope: {
            config: '='
        },
        templateUrl: 'views/grid.html',
        controller: function ($scope) {
            _.each($scope.config.columns, function (value) {
                if (value.edit) {
                    value.afterEdit = value.afterEdit || function () {
                        };
                }
            });

            $scope.config = _.extend({
                enableSelect: false,
                columns: null,
                data: [],
                next: null,
                actions: []
            }, $scope.config);

            $scope.checkAll = false;
            $scope.onCheckAll = function () {
                $scope.checkAll = !$scope.checkAll;
                _.each($scope.config.data, function (value) {
                    value._checked = $scope.checkAll;
                });
            };

            $scope.onBatch = function (action, event) {
                var selects = _.filter($scope.config.data, function (value) {
                    return value._checked;
                });
                if (selects.length > 0) {
                    action.batch(selects, $scope.config.data, event);
                }
            };

            $scope.onAfterEdit = function (value, col, data) {
                if (value.newValue !== value.oldValue) {
                    var promise = col.afterEdit(data, col, value.newValue, value.oldValue);
                    if (promise) {
                        promise.then(function () {
                            $zl.tips('修改成功');
                        }, function () {
                            $zl.tips('修改失败');
                            data[col.field] = value.oldValue;
                        });
                    }
                }
            };

            $scope.onEditData = function (col) {
                return col.editData();
            };

            $scope.getData = function () {
                $scope.config.getData($scope.config.next).then(function (data) {
                    _.each(data, function (value, key) {
                        if (key !== 'pageOffset' && key !== 'pageAnchor') {
                            $scope.config.data = $scope.config.data.concat(value || []);
                        }
                    });
                    $scope.config.next = data.nextPageOffset || data.nextPageAnchor;
                });
            };

            $scope.getData();
        }
    };
}).directive('zlGridEdit', function ($zlFocusOn, $timeout) {
    'use strict';

    return {
        restrict: 'A',
        replace: true,
        scope: {
            gridModel: '=',
            gridAfterEdit: '&'
        },
        templateUrl: 'views/grid.edit.html',
        controller: function ($scope, $element) {
            $scope.edit = false;

            var oldValue = $scope.gridModel;

            // 这里很纠结 如果采用ng-show 的方式,则计算width不准确。因为一开始input显示出来占地方。
            // 如果采用ng-if的话，导致模型更新不及时。 gridModel 还是旧数据
            // and  模型的更新还是挺重要的。 所以采用ng-show 方案。 至于计算宽度问题，一开始把input display:none 掉就好了。 哈哈
            $element.closest('td').width($element.width());

            $scope.onEdit = function (event) {
                $element.addClass('zl-grid-edit-on');
                $scope.edit = true;
                $zlFocusOn('zlGridEditInput');
            };

            $scope.cancelEdit = function ($event) {
                $scope.edit = false;
            };

            $scope.onEnter = function (event) {
                if (event.keyCode === 13) {
                    $scope.edit = false;
                    // 避免因为模型没有更新，导致数据不正确。故timeout
                    $scope.gridModel = event.target.value;
                    $timeout(function () {
                        $scope.gridAfterEdit({
                            value: {
                                newValue: $scope.gridModel,
                                oldValue: oldValue
                            }
                        });
                    }, 1);
                } else if (event.keyCode === 27) {
                    $scope.edit = false;
                    $scope.gridModel = oldValue;
                }
            };
        }
    };
}).directive('zlGridEditSelect', function ($zlFocusOn, $timeout) {
    'use strict';

    return {
        restrict: 'A',
        replace: true,
        scope: {
            gridModel: '=',
            gridAfterEdit: '&',
            gridEditType: '@',
            gridEditData: '&'
        },
        templateUrl: 'views/grid.edit.select.html',
        controller: function ($scope, $element) {
            $scope.edit = false;

            var oldValue = $scope.gridModel;

            $scope.selects = [];
            $scope.selected = null;
            $scope.gridEditData().then(function (data) {
                $scope.selects = data;
                $scope.selected = _.find(data, function (value) {
                    return value.value === $scope.gridModel;
                });
            });

            // 这里很纠结 如果采用ng-show 的方式,则计算width不准确。因为一开始input显示出来占地方。
            // 如果采用ng-if的话，导致模型更新不及时。 gridModel 还是旧数据
            // and  模型的更新还是挺重要的。 所以采用ng-show 方案。 至于计算宽度问题，一开始把input display:none 掉就好了。 哈哈
            $element.closest('td').width($element.width());

            $scope.onEdit = function (event) {
                $element.addClass('zl-grid-edit-on');
                $scope.edit = true;
                $zlFocusOn('zlGridEditInput');
            };

            $scope.cancelEdit = function () {
                //$scope.edit = false;
                //$scope.gridModel = oldValue;
            };

            $scope.onChange = function (event) {
                $scope.edit = false;
                $scope.gridModel = $scope.selected.value;
                // 避免因为模型没有更新，导致数据不正确。故timeout
                $timeout(function () {
                    $scope.gridAfterEdit({
                        value: {
                            newValue: $scope.gridModel,
                            oldValue: oldValue
                        }
                    });
                }, 1);
            };
        }
    };
});