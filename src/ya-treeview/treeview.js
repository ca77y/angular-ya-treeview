'use strict';

angular.module('ya.treeview', [])
    .factory('YaTreeviewService', function () {
        var service = {};

        var hasChildren = function (node, options) {
            return angular.isArray(node[options.childrenKey]) || node[options.hasChildrenKey];
        };

        service.children = function (node, options) {
            var children = node.$model[options.childrenKey];
            if (angular.isFunction(children)) {
                return children();
            } else {
                return children;
            }
        };

        service.nodify = function (node, parent, options) {
            var vnode = {
                $model: node,
                $parent: parent,
                $hasChildren: hasChildren(node, options),
                collapsed: options.collapseByDefault
            };
            if (vnode.$hasChildren) {
                if (options.lazy) {
                    vnode.$children = [];
                } else {
                    vnode.$children = service.nodifyArray(service.children(vnode, options), node, options);
                }
            }
            return vnode;
        };

        service.nodifyArray = function (nodes, parent, options) {
            var vnodes = [];
            angular.forEach(nodes, function (node) {
                vnodes.push(service.nodify(node, parent, options));
            });
            return vnodes;
        };

        return service;
    })
    .controller('YaTreeviewCtrl', function ($scope, YaTreeviewService) {
        var self = this;

        var fillOptions = function (clientOptions) {
            var options = {};
            clientOptions = clientOptions || {};

            options.childrenKey = clientOptions.childrenKey || 'children';
            options.hasChildrenKey = clientOptions.hasChildrenKey || 'has_children';
            options.onExpand = clientOptions.onExpand || angular.noop;
            options.onCollapse = clientOptions.onCollapse || angular.noop;
            options.onSelect = clientOptions.onSelect || angular.noop;
            options.OnDblClick = !!clientOptions.OnDblClick || angular.noop;
            options.collapseByDefault = !!clientOptions.collapseByDefault || true;
            options.lazy = !!clientOptions.lazy || false;
            self.context = clientOptions.context || {};

            return validateOptions(options);
        };

        var validateOptions = function (options) {
            if (options.lazy && !options.collapseByDefault) {
                throw new Error('Yea, right... lazy load expanded tree...');
            }

            return options;
        };

        var spanTree = function (nodes) {
            return YaTreeviewService.nodifyArray(nodes, null, options);
        };

        this.expand = function (node) {
            if (node.$hasChildren && node.$children.length === 0) {
                var children = YaTreeviewService.children(node, options);
                node.$children = YaTreeviewService.nodifyArray(children, node, options);
            }
            node.collapsed = false;
            options.onExpand(node, self.context);
        };

        this.collapse = function (node) {
            node.collapsed = true;
            options.onCollapse(node, self.context);
        };

        this.selectNode = function ($event, node) {
            self.context.selectedNode = node;
            options.onSelect($event, node, self.context);
        };

        this.dblClick = function ($event, node) {
            options.OnDblClick($event, node, self.context);
        };

        var options = fillOptions($scope.options);
        $scope.tree = spanTree($scope.model);
        $scope.expand = this.expand;
        $scope.collapse = this.collapse;
        $scope.selectNode = this.selectNode;
        $scope.context = this.context;
        $scope.dblClick = this.dblClick;
        self.context.nodify = function (node, parent) {
            return YaTreeviewService.nodify(node, parent, options);
        };
        self.context.nodifyArray = function (nodes, parent) {
            return YaTreeviewService.nodifyArray(nodes, parent, options)
        };
        self.context.children = function (node) {
            return YaTreeviewService.children(node, options);
        };

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