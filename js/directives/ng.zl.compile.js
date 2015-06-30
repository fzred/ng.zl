angular.module('ng.zl').directive('zlCompile', function ($compile) {
    'use strict';
    return {
        replace: true,
        restrict: 'EA',
        link: function (scope, elm) {
            var DUMMY_SCOPE = {
                    $destroy: angular.noop
                },
                root = elm,
                childScope,
                destroyChildScope = function () {
                    (childScope || DUMMY_SCOPE).$destroy();
                };

            iAttrs.$observe('html', function (html) {
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
});
