angular.module('ng.zl.exporter', []).factory('$zlExporter', function () {
    'use strict';

    var exporter = {};


    //var header = [{field: 'id', name: '编号'}];

    function data2csv(data, header){
        var result = [];

        result.push(_.map(header, function (value) {
            return value.name;
        }));

        angular.forEach(data, function (value) {
            result.push(_.map(header, function (val) {
                return value[val.field] + '';
            }).join(','));
        });

        return result.join('\n');
    }

    exporter.toCsv = function (name, data, header) {
        data = angular.copy(data);
        name = name || 'table.csv';
        if(name.slice(-4) !== '.csv'){
            name += '.csv';
        }
        var blob = new Blob([data2csv(data, header)], {type: 'text/csv;charset=utf-8'});
        window.saveAs(blob, name);
    };

    return exporter;
});