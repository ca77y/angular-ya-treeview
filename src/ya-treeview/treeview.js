'use strict';

angular.module('ya.treeview', [])
    .directive('yaTreeview', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/ya-treeview/node.tpl.html'
        };
    });