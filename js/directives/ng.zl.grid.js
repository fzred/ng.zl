angular.module('ng.zl.grid', ['ng.zl', 'ng.zl.grid.edit']).directive('zlGrid', function ($zl) {
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
                    if(promise){
                        promise.then(function () {
                            $zl.tips('修改成功');
                        }, function () {
                            $zl.tips('修改失败');
                            data[col.field] = value.oldValue;
                        });
                    }
                }
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
});

angular.module('ng.zl.grid.edit', []).directive('zlGridEdit', function (FocusOnService) {
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
                FocusOnService('zlGridEditInput');
            };

            $scope.cancelEdit = function () {
                $scope.edit = false;
                $scope.gridModel = oldValue;
            };

            $scope.onEnter = function (event) {
                if (event.keyCode === 13) {
                    $scope.edit = false;
                    $scope.gridAfterEdit({
                        value: {
                            newValue: $scope.gridModel,
                            oldValue: oldValue
                        }
                    });
                }else if(event.keyCode === 27){
                    $scope.edit = false;
                    $scope.gridModel = oldValue;
                }
            };
        }
    };
});