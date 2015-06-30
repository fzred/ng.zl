angular.module('ng.zl', ['ng', 'ngSanitize','ngMaterial','ng.zl.sha256', 'ng.zl.templates']);
angular.module("ng.zl.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("views/grid.edit.html","<div class=\"zl-grid-edit\" ng-dblclick=\"onEdit($event)\">\r\n    <span ng-bind=\"gridModel\" ng-show=\"!edit\"></span>\r\n    <input type=\"text\" tabindex=\"-1\" ng-model=\"gridModel\" ng-show=\"edit\" ng-blur=\"cancelEdit($event)\" ng-keyup=\"onKey($event)\" zl-focus-on=\"zlGridEditInput\"/>\r\n</div>");
$templateCache.put("views/grid.edit.select.html","<div class=\"zl-grid-edit\" ng-dblclick=\"onEdit($event)\">\r\n    <span ng-bind=\"gridModel\" ng-show=\"!edit\"></span>\r\n    <select tabindex=\"-1\" ng-model=\"selected\" ng-show=\"edit\" zl-focus-on=\"zlGridEditSelect\" ng-blur=\"cancelEdit($event)\" ng-options=\"value.name for value in selects\" ng-change=\"onChange($event)\" ng-keyup=\"onKey($event)\">\r\n    </select>\r\n</div>");
$templateCache.put("views/grid.edit.switch.html","<div class=\"zl-grid-edit\" ng-dblclick=\"onEdit($event)\">\r\n    <span ng-bind=\"gridModel\" ng-show=\"!edit\"></span>\r\n\r\n    <md-switch class=\"md-primary\" tabindex=\"-1\" ng-model=\"gridModel\" aria-label=\"Switch\" zl-focus-on=\"zlGridEditSwitch\" ng-show=\"edit\" ng-blur=\"cancelEdit($event)\" ng-keyup=\"onKey($event)\" ng-change=\"onChange($event)\"></md-switch>\r\n\r\n</div>");
$templateCache.put("views/grid.html","<div class=\"zl-grid\">\r\n    <table class=\"table table-striped table-hover table-condensed\">\r\n        <thead>\r\n        <tr>\r\n            <th ng-if=\"config.enableSelect\" class=\"zl-grid-select\">\r\n                <md-checkbox ng-click=\"onCheckAll($event)\"></md-checkbox>\r\n            </th>\r\n            <th ng-repeat=\"col in config.columns\" ng-bind=\"col.name\"></th>\r\n            <th ng-if=\"config.actions.length > 0\">操作</th>\r\n        </tr>\r\n        </thead>\r\n        <tbody>\r\n        <tr ng-repeat=\"data in config.data\">\r\n            <td ng-if=\"config.enableSelect\" class=\"zl-grid-select\">\r\n                <md-checkbox ng-model=\"data._checked\"></md-checkbox>\r\n            </td>\r\n            <td ng-repeat=\"col in config.columns\">\r\n                <span ng-if=\"!col.edit && col.render\" style=\"{{col.style}}\">\r\n                    <div zl-compile html=\"{{col.render(data[col.field])}}\"></div>\r\n                </span>\r\n                <span ng-if=\"!col.edit && !col.render\" ng-bind=\"data[col.field]\" style=\"{{col.style}}\"></span>\r\n\r\n                <div ng-if=\"col.edit && col.editType === \'input\'\">\r\n                    <div zl-grid-edit grid-model=\"data[col.field]\" grid-after-edit=\"onAfterEdit(value, col, data)\"></div>\r\n                </div>\r\n                <div ng-if=\"col.edit && col.editType === \'select\'\">\r\n                    <div zl-grid-edit-select grid-model=\"data[col.field]\" grid-edit-type=\"col.editType\" grid-edit-data=\"col.editData()\" grid-after-edit=\"onAfterEdit(value, col, data)\"></div>\r\n                </div>\r\n                <div ng-if=\"col.edit && col.editType === \'switch\'\">\r\n                    <div zl-grid-edit-switch grid-model=\"data[col.field]\" grid-after-edit=\"onAfterEdit(value, col, data)\"></div>\r\n                </div>\r\n            </td>\r\n\r\n            <td ng-if=\"config.actions.length > 0\">\r\n                <md-button ng-repeat=\"act in config.actions\" class=\"md-raised {{act.className}}\" ng-bind=\"act.html\"\r\n                           ng-click=\"act.action(data, config.data, $event)\"></md-button>\r\n            </td>\r\n        </tr>\r\n        </tbody>\r\n    </table>\r\n    <div layout=\"row\">\r\n        <md-button class=\"md-raised\" ng-click=\"getData()\" ng-if=\"config.next\">More</md-button>\r\n        <md-button class=\"md-raised\" ng-if=\"!config.next\" ng-disabled=\"true\">No More</md-button>\r\n        <div flex ng-if=\"config.enableSelect && config.actions.length > 0\">\r\n            <md-button ng-repeat=\"act in config.actions\" class=\"md-raised {{act.className}}\" ng-bind=\"act.html\"\r\n                       ng-click=\"onBatch(act, $event)\"></md-button>\r\n        </div>\r\n    </div>\r\n</div>");
$templateCache.put("views/progress.html","<div class=\"zl-progress\" ng-if=\"show\">\r\n    <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\r\n</div>");
$templateCache.put("views/scroll.html","<div class=\"zl-scroll\">\r\n    <div ng-show=\"isShow\">\r\n    <md-button class=\"md-fab md-primary md-mini\" ng-click=\"onTop()\" ng-if=\"top\">\r\n        t\r\n    </md-button>\r\n\r\n    <md-button class=\"md-fab md-primary md-mini\" ng-click=\"onBottom()\" ng-if=\"bottom\">\r\n        b\r\n    </md-button>\r\n    </div>\r\n</div>");
$templateCache.put("views/toast.html","<div class=\"zl-toast-container\">\r\n    <md-toast ng-repeat=\"t in list\" class=\"md-default-theme\">\r\n        <span ng-bind=\"t.word\"></span>\r\n    </md-toast>\r\n</div>");}]);
angular.module('ng.zl').directive('zlCompile', ["$compile", function ($compile) {
    'use strict';
    return {
        replace: true,
        restrict: 'A',
        link: function (scope, elm, attrs) {
            if(attrs.html){
                var dom = $compile(attrs.html)(scope);
                elm.replaceWith(dom);
            }
        }
    };
}]);

angular.module('ng.zl').directive('zlDyCompile', ["$compile", function ($compile) {
    'use strict';
    return {
        replace: true,
        restrict: 'A',
        link: function (scope, elm, attrs) {
            var DUMMY_SCOPE = {
                    $destroy: angular.noop
                },
                root = elm,
                childScope,
                destroyChildScope = function () {
                    (childScope || DUMMY_SCOPE).$destroy();
                };

            attrs.$observe('html', function (html) {
                if (html) {
                    destroyChildScope();
                    childScope = scope.$new(true);
                    var content = $compile(html)(scope);
                    root.replaceWith(content);
                    root = content;
                }

                scope.$on('$destroy', destroyChildScope);
            });
        }
    };
}]);

angular.module('ng.zl').directive('zlFocusOn', function () {
    'use strict';
    return function (scope, elem, attr) {
        return scope.$on('zlFocusOn', function (e, name) {
            if (name === attr.zlFocusOn) {
                return elem[0].focus();
            }
        });
    };
});
angular.module('ng.zl.grid', ['ng.zl']).directive('zlGrid', ["$zl", function ($zl) {
    'use strict';

    /*支持修改文本和修改select。 改后值为新的，此时会调用afterEdit,返回promise,如果失败会回复原始值*/
    /*$scope.gridData = {
     enableSelect: true,
     columns: [
     {field: 'serialNumber', name: '序号'},
     {field: 'type', name: '类型', edit: true, editType: 'input', afterEdit: afterEdit},
     {field: 'gender', name: '性别', edit: true, editType: 'select', editData: getEditData, afterEdit: afterEdit}
     ],
     actions: [{
     type: 'btn',
     html: '删除',
     action: onDel,
     batch: onDels
     }],
     // 需要返回这种格式 { xxxx: datas, nextPageOffset: x}, 其中 xxxx 是任意，nextPageOffset 也可以是 nextPageAnchor.
     // 返回next,代表nextPageOffset或者nextPageAnchor的值
     getData: function (next) {
     return DataService.getConfigType();
     }
     };*/

    return {
        restrict: 'A',
        replace: true,
        scope: {
            config: '='
        },
        templateUrl: 'views/grid.html',
        controller: ["$scope", function ($scope) {
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
        }]
    };
}]).directive('zlGridEdit', ["$zlFocusOn", "$timeout", function ($zlFocusOn, $timeout) {
    'use strict';

    return {
        restrict: 'A',
        replace: true,
        scope: {
            gridModel: '=',
            gridAfterEdit: '&'
        },
        templateUrl: 'views/grid.edit.html',
        controller: ["$scope", "$element", function ($scope, $element) {
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

            $scope.cancelEdit = function (event) {
                $scope.edit = false;
            };

            $scope.onKey = function (event) {
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
        }]
    };
}]).directive('zlGridEditSelect', ["$zlFocusOn", "$timeout", function ($zlFocusOn, $timeout) {
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
        controller: ["$scope", "$element", function ($scope, $element) {
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

            $element.closest('td').width($element.width());

            $scope.onEdit = function (event) {
                $element.addClass('zl-grid-edit-on');
                $scope.edit = true;
                $zlFocusOn('zlGridEditSelect');
            };

            $scope.cancelEdit = function () {
                $scope.edit = false;
            };

            $scope.onKey = function () {
                if (event.keyCode === 27) {
                    $scope.edit = false;
                    $scope.gridModel = oldValue;
                }
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
        }]
    };
}]).directive('zlGridEditSwitch', ["$zlFocusOn", "$timeout", function ($zlFocusOn, $timeout) {
    'use strict';

    return {
        restrict: 'A',
        replace: true,
        scope: {
            gridModel: '=',
            gridAfterEdit: '&'
        },
        templateUrl: 'views/grid.edit.switch.html',
        controller: ["$scope", "$element", function ($scope, $element) {
            $scope.edit = false;

            $scope.gridModel = $scope.gridModel || false;
            var oldValue = $scope.gridModel;

            $element.closest('td').width($element.width());

            $scope.onEdit = function (event) {
                $element.addClass('zl-grid-edit-on');
                $scope.edit = true;
                $zlFocusOn('zlGridEditSwitch');
            };

            $scope.cancelEdit = function (event) {
                $scope.edit = false;
            };

            $scope.onKey = function (event) {
                if (event.keyCode === 27) {
                    $scope.edit = false;
                    $scope.gridModel = oldValue;
                }
            };

            $scope.onChange = function (event) {
                $scope.edit = false;
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
        }]
    };
}]);
angular.module('ng.zl').directive('zlScroll', ["$zl", "$mdMedia", function ($zl, $mdMedia) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        scope: {},
        templateUrl: 'views/scroll.html',
        controller: ["$scope", "$element", function ($scope, $element) {

            var params = $element.attr('zl-scroll');
            if (params.indexOf('scroll-top') > -1) {
                $scope.top = true;
            }
            if (params.indexOf('scroll-bottom') > -1) {
                $scope.bottom = true;
            }

            $scope.onTop = function () {
                $zl.scroll.top();
            };

            $scope.onBottom = function () {
                $zl.scroll.bottom();
            };

            $scope.isShow = $mdMedia('gt-md');
        }]
    };
}]);
angular.module('ng.zl').factory('$zlFocusOn', ["$rootScope", "$timeout", function ($rootScope, $timeout) {
    'use strict';
    return function (name) {
        return $timeout(function () {
            return $rootScope.$broadcast('zlFocusOn', name);
        });
    };
}]);
angular.module('ng.zl').factory('$zl', ["$mdDialog", "$mdToast", "$compile", "$rootScope", "$templateRequest", "$timeout", "$zlSha256", "$q", function ($mdDialog, $mdToast, $compile, $rootScope, $templateRequest, $timeout, $zlSha256, $q) {
    'use strict';

    var $container = $(document.body);

    var alert = function (word, title, ev) {
        var d = $mdDialog.alert().parent($container).title(title).content(word).ok('ok');
        if (ev) {
            d = d.targetEvent(ev);
        }
        return $mdDialog.show(d);
    };
    var confirm = function (word, title, ev, ok, cancel) {
        ok = ok || 'ok';
        cancel = cancel || 'cancel';
        var d = $mdDialog.confirm().parent($container).title(title).content(word).ok(ok).cancel(cancel);
        if (ev) {
            d = d.targetEvent(ev);
        }
        return $mdDialog.show(d);
    };

    var _$toast = null;
    var _toastScope = $rootScope.$new();
    _toastScope.list = [];
    var toast = function (word, type, time) {
        var def = $q.defer();

        if (!_$toast) {
            _$toast = true;
            $templateRequest('views/toast.html').then(function (data) {
                _$toast = $(data);
                $(document.body).append(_$toast);
                $compile(_$toast)(_toastScope);
            });
        }
        var key = +new Date();
        _toastScope.list.unshift({word: word, _key_: key});
        $timeout(function () {
            _toastScope.list.splice(_toastScope.list.indexOf(_.find(_toastScope.list, function (value) {
                return value._key_ === key;
            })), 1);
            def.resolve({});
        }, time || 4000);

        return def.promise;
    };

    var _$progress = null;
    var _progressScope = $rootScope.$new();
    _progressScope.show = false;
    var progress = {
        start: function () {
            if (!_$progress) {
                _$progress = true;
                $templateRequest('views/progress.html').then(function (data) {
                    _$progress = $(data);
                    $(document.body).append(_$progress);
                    $compile(_$progress)(_progressScope);
                });
            }
            _progressScope.show = true;
        },
        done: function () {
            _progressScope.show = false;
        }
    };


    var scroll = {
        set: function (value) {
            var _content = $('.site-content')[0];
            _content.scrollTop = value;
        },
        top: function () {
            scroll.set(0);
        },
        bottom: function () {
            scroll.set($(document.body).height());
        },
        page: function () {
            scroll.set(document.body.scrollTop + document.documentElement.clientHeight);
        }
    };

    var format = function (str, data) {
        var result = str;
        if (arguments.length < 2) {
            return result;
        }

        result = result.replace(/\{([\d\w\.]+)\}/g, function (key) {
            var keys = arguments[1].split('.');
            var r = null;
            _.each(keys, function (value, index) {
                if (index) {
                    r = r[value];
                } else {
                    r = data[value];
                }
            });
            return r;
        });
        return result;
    };

    var _userInfo = null;
    var userInfo = {
        set: function (info) {
            _userInfo = info;
        },
        get: function () {
            return _userInfo;
        }
    };


    var ZL = {
        alert: alert,
        confirm: confirm,
        tips: toast,
        progress: progress,
        scroll: scroll,
        format: format,
        sha256: $zlSha256,
        userInfo: userInfo
    };

    // 虽然暴漏给外面。 但是涉及到ng的生命周期的都不能载控制台来调用。
    window.ZL = ZL;

    return ZL;
}]);
angular.module('ng.zl.sha256', []).factory('$zlSha256', function () {
    'use strict';
    var sha256 = function (str) {
        function rotateRight(n, x) {
            return ((x >>> n) | (x << (32 - n)));
        }

        function choice(x, y, z) {
            return ((x & y) ^ (~x & z));
        }

        function majority(x, y, z) {
            return ((x & y) ^ (x & z) ^ (y & z));
        }

        function sha256_Sigma0(x) {
            return (rotateRight(2, x) ^ rotateRight(13, x) ^ rotateRight(22, x));
        }

        function sha256_Sigma1(x) {
            return (rotateRight(6, x) ^ rotateRight(11, x) ^ rotateRight(25, x));
        }

        function sha256_sigma0(x) {
            return (rotateRight(7, x) ^ rotateRight(18, x) ^ (x >>> 3));
        }

        function sha256_sigma1(x) {
            return (rotateRight(17, x) ^ rotateRight(19, x) ^ (x >>> 10));
        }

        function sha256_expand(W, j) {
            return (W[j & 0x0f] += sha256_sigma1(W[(j + 14) & 0x0f]) + W[(j + 9) & 0x0f] +
                sha256_sigma0(W[(j + 1) & 0x0f]));
        }

        /* Hash constant words K: */
        var K256 = new Array(
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
            0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
            0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
            0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
            0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
            0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
            0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
            0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
            0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        );

        /* global arrays */
        var ihash, count, buffer;
        var sha256_hex_digits = "0123456789abcdef";

        /* Add 32-bit integers with 16-bit operations (bug in some JS-interpreters:
         overflow) */
        function safe_add(x, y) {
            var lsw = (x & 0xffff) + (y & 0xffff);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xffff);
        }

        /* Initialise the SHA256 computation */
        function sha256_init() {
            ihash = new Array(8);
            count = new Array(2);
            buffer = new Array(64);
            count[0] = count[1] = 0;
            ihash[0] = 0x6a09e667;
            ihash[1] = 0xbb67ae85;
            ihash[2] = 0x3c6ef372;
            ihash[3] = 0xa54ff53a;
            ihash[4] = 0x510e527f;
            ihash[5] = 0x9b05688c;
            ihash[6] = 0x1f83d9ab;
            ihash[7] = 0x5be0cd19;
        }


        /* Transform a 512-bit message block */
        function sha256_transform() {
            var a, b, c, d, e, f, g, h, T1, T2;
            var W = new Array(16);

            /* Initialize registers with the previous intermediate value */
            a = ihash[0];
            b = ihash[1];
            c = ihash[2];
            d = ihash[3];
            e = ihash[4];
            f = ihash[5];
            g = ihash[6];
            h = ihash[7];

            /* make 32-bit words */
            for (var i = 0; i < 16; i++)
                W[i] = ((buffer[(i << 2) + 3]) | (buffer[(i << 2) + 2] << 8) | (buffer[(i << 2) + 1] << 16) | (buffer[i << 2] << 24));

            for (var j = 0; j < 64; j++) {
                T1 = h + sha256_Sigma1(e) + choice(e, f, g) + K256[j];
                if (j < 16) T1 += W[j];
                else T1 += sha256_expand(W, j);
                T2 = sha256_Sigma0(a) + majority(a, b, c);
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }

            /* Compute the current intermediate hash value */
            ihash[0] += a;
            ihash[1] += b;
            ihash[2] += c;
            ihash[3] += d;
            ihash[4] += e;
            ihash[5] += f;
            ihash[6] += g;
            ihash[7] += h;
        }

        /* Read the next chunk of data and update the SHA256 computation */
        function sha256_update(data, inputLen) {
            var i, index, curpos = 0;
            /* Compute number of bytes mod 64 */
            index = ((count[0] >> 3) & 0x3f);
            var remainder = (inputLen & 0x3f);

            /* Update number of bits */
            if ((count[0] += (inputLen << 3)) < (inputLen << 3)) count[1]++;
            count[1] += (inputLen >> 29);

            /* Transform as many times as possible */
            for (i = 0; i + 63 < inputLen; i += 64) {
                for (var j = index; j < 64; j++)
                    buffer[j] = data.charCodeAt(curpos++);
                sha256_transform();
                index = 0;
            }

            /* Buffer remaining input */
            for (var j = 0; j < remainder; j++)
                buffer[j] = data.charCodeAt(curpos++);
        }

        /* Finish the computation by operations such as padding */
        function sha256_final() {
            var index = ((count[0] >> 3) & 0x3f);
            buffer[index++] = 0x80;
            if (index <= 56) {
                for (var i = index; i < 56; i++)
                    buffer[i] = 0;
            } else {
                for (var i = index; i < 64; i++)
                    buffer[i] = 0;
                sha256_transform();
                for (var i = 0; i < 56; i++)
                    buffer[i] = 0;
            }
            buffer[56] = (count[1] >>> 24) & 0xff;
            buffer[57] = (count[1] >>> 16) & 0xff;
            buffer[58] = (count[1] >>> 8) & 0xff;
            buffer[59] = count[1] & 0xff;
            buffer[60] = (count[0] >>> 24) & 0xff;
            buffer[61] = (count[0] >>> 16) & 0xff;
            buffer[62] = (count[0] >>> 8) & 0xff;
            buffer[63] = count[0] & 0xff;
            sha256_transform();
        }

        /* Split the internal hash values into an array of bytes */
        function sha256_encode_bytes() {
            var j = 0;
            var output = new Array(32);
            for (var i = 0; i < 8; i++) {
                output[j++] = ((ihash[i] >>> 24) & 0xff);
                output[j++] = ((ihash[i] >>> 16) & 0xff);
                output[j++] = ((ihash[i] >>> 8) & 0xff);
                output[j++] = (ihash[i] & 0xff);
            }
            return output;
        }

        /* Get the internal hash as a hex string */
        function sha256_encode_hex() {
            var output = new String();
            for (var i = 0; i < 8; i++) {
                for (var j = 28; j >= 0; j -= 4)
                    output += sha256_hex_digits.charAt((ihash[i] >>> j) & 0x0f);
            }
            return output;
        }

        /* Main function: returns a hex string representing the SHA256 value of the
         given data */
        function sha256_digest(data) {
            sha256_init();
            sha256_update(data, data.length);
            sha256_final();
            return sha256_encode_hex();
        }

        /* test if the JS-interpreter is working properly */
        function sha256_self_test() {
            return sha256_digest("message digest") ==
                "f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650";
        }

        return sha256_digest(str);
    };
    return sha256;
});