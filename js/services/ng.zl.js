angular.module('ng.zl').factory('$zl', function ($mdDialog, $mdToast, $compile, $rootScope, $templateRequest, $timeout, $zlSha256, $q) {
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
});