'use strict';

angular.module('ya.treeview', [])
    .controller('YaTreeviewCtrl', function ($scope) {
        var spanView = function (nodes) {
            var tree = [];
            var recursSpanTree = function (parent, children, root) {
                var level = [];
                angular.forEach(children, function (child) {
                    var vnode = {
                        $model: child,
                        $parent: parent,
                        $root: root,
                        collapsed: true
                    };
                    if (!!child.children && (child.children.length > 0)) {
                        vnode.$children = recursSpanTree(child, child.children, root);
                    }
                    level.push(vnode);
                });
                return level;
            };

            angular.forEach(nodes, function (node) {
                var vnode = {
                    $model: node,
                    $parent: null,
                    $root: null,
                    collapsed: true
                };
                if (node.children && node.children.length > 0) {
                    vnode.$children = recursSpanTree(node, node.children, node);
                }
                tree.push(vnode);
            });

            return tree;
        };

        $scope.view = spanView($scope.model);

        $scope.hasChildren = function (node) {
            return !!node.$children && (node.$children.length > 0)
        };

        $scope.showExpand = function (node) {
            return node.collapsed && $scope.hasChildren(node);
        };

        $scope.showCollapse = function (node) {
            return !node.collapsed && $scope.hasChildren(node);
        };
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
            compile: function (tElement, tAttrs, tTranscludeFn) {
                return function (scope, iElement, iAttrs, treeviewCtrl) {
                    treeviewCtrl.transcludeFn = tTranscludeFn;
                }
            }
        };
    })
    .directive('yaNode', function ($compile) {
        return {
            restrict: 'AE',
            replace: false,
            require: '^yaTreeview',
            scope: {
                node: '=yaNode',
                showExpand: '=yaShowExpand',
                showCollapse: '=yaShowCollapse'
            },
            templateUrl: 'templates/ya-treeview/children.tpl.html',
            compile: function (tElement, tAttrs) {
                var template = tElement.clone();
                tElement.empty();
                return function (scope, iElement, iAttrs, treeviewCtrl) {
                    treeviewCtrl.transcludeFn(scope, function(clone) {
                        iElement.append(clone);
                    });

                    if (angular.isArray(scope.node.$children) && scope.node.$children.length > 0) {
                        iElement.append($compile(template.html())(scope));
                    }
                }
            }
        };
    });