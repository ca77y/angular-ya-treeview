'use strict';

angular.module('ya.treeview', [])
    .controller('YaTreeviewCtrl', function ($scope) {
        var spanView = function (nodes) {
            var tree = [];
            var recursSpanTree = function(parent, children, root) {
                var tree = [];
                angular.forEach(children, function(child) {
                    var vnode = {
                        $model: child,
                        $parent: parent,
                        $root: root
                    };
                    if(child.children && child.children.length > 0) {
                        vnode.$children = recursSpanTree(child, child.children, root);
                    }
                    tree.push(vnode);
                });
                return tree;
            };

            angular.forEach(nodes, function(node) {
                var vnode = {
                    $model: node,
                    $parent: null,
                    $root: null
                };
                if(node.children && node.children.length > 0) {
                    vnode.$children = recursSpanTree(node, node.children, node);
                }
                tree.push(vnode);
            });

            return tree;
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
                        iElement.append(scope.node.$model.label);
                    });

                    if (angular.isArray(scope.node.$children) && scope.node.$children.length > 0) {
                        iElement.append($compile(template.html())(scope));
                    }
                }
            }
        };
    });