'use strict';

angular.module('ya.treeview', [])
    .controller('YaTreeviewCtrl', function ($scope) {
        var self = this;
        self.context = {};

        var spanView = function (nodes) {
            var tree = [];

            var recursSpanTree = function (parent, children, root) {
                var level = [];
                angular.forEach(children, function (child) {
                    var vnode = {
                        $model: child,
                        $parent: parent,
                        $root: root,
                        collapsed: self.options.collapseByDefault
                    };
                    if (hasChildren(child, self.options.childrenKey)) {
                        vnode.$children = recursSpanTree(child, child[self.options.childrenKey], root);
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
                    collapsed: self.options.collapseByDefault
                };

                if (hasChildren(node, self.options.childrenKey)) {
                    vnode.$children = recursSpanTree(node, node[self.options.childrenKey], node);
                }

                tree.push(vnode);
            });

            return tree;
        };

        var fillOptions = function (clientOptions) {
            var options = {};
            clientOptions = clientOptions || {};

            options.childrenKey = clientOptions.childrenKey || 'children';
            options.onExpand = clientOptions.onExpand || angular.noop;
            options.onCollapse = clientOptions.onCollapse || angular.noop;
            options.onSelect = clientOptions.onSelect || angular.noop;
            options.OnDblClick = !!clientOptions.OnDblClick || angular.noop;
            options.collapseByDefault = !!clientOptions.collapseByDefault || true;

            return options;
        };

        var hasChildren = function (node, key) {
            key = key || '$children';
            return angular.isArray(node[key]) && (node[key].length > 0);
        };

        this.expand = function (node) {
            node.collapsed = false;
            self.options.onExpand(node, self.context);
        };

        this.collapse = function (node) {
            node.collapsed = true;
            self.options.onCollapse(node, self.context);
        };

        this.showExpand = function (node) {
            return node.collapsed && hasChildren(node);
        };

        this.showCollapse = function (node) {
            return !node.collapsed && hasChildren(node);
        };

        this.selectNode = function (node) {
            self.context.selectedNode = node;
            self.options.onSelect(node, self.context);
        };

        this.dblClick = function (node) {
            self.options.OnDblClick(node, self.context);
        };

        this.options = fillOptions($scope.options);
        $scope.tree = spanView($scope.model);

        $scope.expand = this.expand;
        $scope.collapse = this.collapse;
        $scope.showCollapse = this.showCollapse;
        $scope.showExpand = this.showExpand;
        $scope.selectNode = this.selectNode;
        $scope.context = this.context;
        $scope.dblClick = this.dblClick;

        $scope.$watch('model', function (newValue) {
            $scope.tree = spanView(newValue);
        });
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
                    scope.expand = treeviewCtrl.expand;
                    scope.collapse = treeviewCtrl.collapse;
                    scope.showCollapse = treeviewCtrl.showCollapse;
                    scope.showExpand = treeviewCtrl.showExpand;
                    scope.context = treeviewCtrl.context;
                    scope.selectNode = treeviewCtrl.selectNode;
                    scope.dblClick = treeviewCtrl.dblClick;

                    scope.$watch(function () {
                        return treeviewCtrl.lastSelectedNode;
                    }, function (newValue) {
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