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

        var hasChildren = function (node) {
            return angular.isArray(node.$children) && (node.$children.length > 0);
        };

        var _selectedNode, _selectedNodes;

        this.showExpand = function (node) {
            return node.collapsed && hasChildren(node);
        };

        this.showCollapse = function (node) {
            return !node.collapsed && hasChildren(node);
        };

        this.selectNode = function (node) {
            _selectedNode = node;
        };

        this.selectedNode = function() {
            return _selectedNode;
        };

        this.selectedNodes = function() {
            return _selectedNodes;
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
            compile: function (tElement, tAttrs, tTranscludeFn) {
                return function (scope, iElement, iAttrs, treeviewCtrl) {
                    treeviewCtrl.transcludeFn = tTranscludeFn;
                };
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
                children: '=yaChildren'
            },
            templateUrl: 'templates/ya-treeview/children.tpl.html',
            compile: function (tElement) {
                var template = tElement.clone();
                tElement.empty();
                return function (scope, iElement, iAttrs, treeviewCtrl) {
                    scope.showCollapse = treeviewCtrl.showCollapse;
                    scope.showExpand = treeviewCtrl.showExpand;
                    scope.selectNode = treeviewCtrl.selectNode;
                    scope.selectedNode = treeviewCtrl.selectedNode;
                    scope.selectedNodes = treeviewCtrl.selectedNodes;

                    scope.$watch(function() {
                        return treeviewCtrl.lastSelectedNode;
                    }, function(newValue) {
                        scope.lastSelectedNode = newValue;
                    });

                    if (angular.isArray(scope.children) && scope.children.length > 0) {
                        iElement.append($compile(template.html())(scope));
                    }
                };
            }
        };
    })
    .directive('yaTransclude', function () {
        return {
            restrict: 'AE',
            replace: false,
            require: '^yaTreeview',
            scope: false,
            template: '',
            link: function (scope, iElement, iAttrs, treeviewCtrl) {
                treeviewCtrl.transcludeFn(scope, function (clone) {
                    if (scope.node) {
                        iElement.append(clone);
                    }
                });
            }
        };
    });