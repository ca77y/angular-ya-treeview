'use strict';

angular.module('ya.treeview', [])
    .controller('YaTreeviewCtrl', function ($scope) {
        var self = this;
        self.context = {};

        var fillOptions = function (clientOptions) {
            var options = {};
            clientOptions = clientOptions || {};

            options.childrenKey = clientOptions.childrenKey || 'children';
            options.onExpand = clientOptions.onExpand || angular.noop;
            options.onCollapse = clientOptions.onCollapse || angular.noop;
            options.onSelect = clientOptions.onSelect || angular.noop;
            options.OnDblClick = !!clientOptions.OnDblClick || angular.noop;
            options.collapseByDefault = !!clientOptions.collapseByDefault || true;
            options.lazy = !!clientOptions.lazy || true;

            return validateOptions(options);
        };

        var validateOptions = function (options) {
            if (options.lazy && !options.collapseByDefault) {
                throw new Error('Yea, right... lazy load expanded tree...');
            }

            return options;
        };

        var spanTree = function (nodes) {
            return spanChildren(null, nodes);
        };

        var spanNode = function (node) {
            if (!node) {
                return [];
            }

            var children = getChildren(node);
            if (angular.isArray(children)) {
                return spanChildren(node, children);
            }
            return [];
        };

        var spanChildren = function (node, children) {
            var level = [];
            angular.forEach(children, function (child) {
                var vnode = {
                    $model: child,
                    $parent: node,
                    $hasChildren: hasChildren(child, self.options.childrenKey),
                    collapsed: self.options.collapseByDefault
                };
                if (vnode.$hasChildren) {
                    if (self.options.lazy) {
                        vnode.$children = [];
                    } else {
                        vnode.$children = spanChildren(child, getChildren(vnode));
                    }
                }
                level.push(vnode);
            });
            return level;
        };

        var hasChildren = function (node, key) {
            key = key || '$children';
            return angular.isArray(node[key]) && (node[key].length > 0);
        };

        var getChildren = function (node) {
            return node.$model[self.options.childrenKey];
        };

        this.expand = function (node) {
            if (node.$children && node.$children.length === 0) {
                node.$children = spanNode(node);
            }
            node.collapsed = false;
            self.options.onExpand(node, self.context);
        };

        this.collapse = function (node) {
            node.collapsed = true;
            self.options.onCollapse(node, self.context);
        };

        this.selectNode = function (node) {
            self.context.selectedNode = node;
            self.options.onSelect(node, self.context);
        };

        this.dblClick = function (node) {
            self.options.OnDblClick(node, self.context);
        };

        this.options = fillOptions($scope.options);
        $scope.tree = spanTree($scope.model);
        $scope.expand = this.expand;
        $scope.collapse = this.collapse;
        $scope.selectNode = this.selectNode;
        $scope.context = this.context;
        $scope.dblClick = this.dblClick;

        $scope.$watch('model', function (newValue) {
            $scope.tree = spanTree(newValue);
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
                    scope.context = treeviewCtrl.context;
                    scope.selectNode = treeviewCtrl.selectNode;
                    scope.dblClick = treeviewCtrl.dblClick;

                    if (angular.isArray(scope.children)) {
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