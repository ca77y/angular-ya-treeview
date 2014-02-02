'use strict';

angular.module('ya.treeview', [])
    .controller('YaTreeviewCtrl', function ($scope) {
        var spanView = function (model) {
            return {
                nodes: model
            };
        };

        $scope.view = spanView($scope.model);
    })
    .directive('yaTreeview', function () {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            controller: 'YaTreeviewCtrl',
            scope: {
                id: '@yaId',
                model: '=yaModel',
                options: '=yaOptions'
            },
            templateUrl: 'templates/ya-treeview/treeview.tpl.html',
            compile: function (tElement, tAttrs) {
                return function (scope, iElement, iAttrs, YaTreeviewCtrl, transcludeFn) {
                    YaTreeviewCtrl.transcludeFn = transcludeFn;
                }
            }
        };
    })
    .directive('yaNode', function ($compile) {
        return {
            restrict: 'AE',
            replace: false,
            requires: '^yaTreeview',
            transclude: true,
            scope: {
                node: '=yaNode'
            },
            templateUrl: 'templates/ya-treeview/children.tpl.html',
            compile: function (tElement, tAttrs) {
                var template = tElement.clone();
                tElement.empty();
                return function (scope, iElement, iAttrs, YaTreeviewCtrl, transcludeFn) {
                    transcludeFn(function (clone) {
                        iElement.append(scope.node.label);
                    });

                    if (angular.isArray(scope.node.children) && scope.node.children.length > 0) {
                        iElement.append($compile(template.html())(scope));
                    }
                }
            }
        };
    });