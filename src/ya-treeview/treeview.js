'use strict';

angular.module('ya.treeview', [])
    .factory('YaTreeviewService', function () {
        var service = {};

        var hasChildren = function (node, options) {
            return angular.isArray(node[options.childrenKey]) || node[options.hasChildrenKey] || false;
        };

        service.children = function (node, options) {
            var children = node.$model[options.childrenKey];
            if (angular.isFunction(children)) {
                return children();
            } else if (angular.isArray(children)) {
                return children;
            } else {
                throw new Error('Children is neither an array nor a function.');
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
        var fillOptions = function (clientOptions) {
            var options = {};
            clientOptions = clientOptions || {};

            options.childrenKey = clientOptions.childrenKey || 'children';
            options.hasChildrenKey = clientOptions.hasChildrenKey || 'has_children';
            options.onExpand = clientOptions.onExpand || angular.noop;
            options.onCollapse = clientOptions.onCollapse || angular.noop;
            options.onSelect = clientOptions.onSelect || angular.noop;
            options.onDblClick = clientOptions.onDblClick || angular.noop;
            options.collapseByDefault = !!clientOptions.collapseByDefault || true;
            options.lazy = !!clientOptions.lazy || false;
            $scope.context = clientOptions.context || {};

            return validateOptions(options);
        };

        var validateOptions = function (options) {
            if (options.lazy && !options.collapseByDefault) {
                throw new Error('Yea, right... lazy load expanded tree...');
            }

            return options;
        };

        var createRootNode = function (nodes) {
            var node = {};
            node[options.childrenKey] = nodes;
            var root = YaTreeviewService.nodify(node, null, options);
            if(options.lazy) {
                root.$children = YaTreeviewService.nodifyArray(nodes, node, options);
            }
            root.$hasChildren = true;
            root.collapsed = false;
            return root;
        };

        $scope.expand = function ($event, node) {
            if (node.$hasChildren && node.$children.length === 0) {
                var children = YaTreeviewService.children(node, options);
                node.$children = YaTreeviewService.nodifyArray(children, node, options);
            }
            node.collapsed = false;
            options.onExpand($event, node, $scope.context);
        };

        $scope.collapse = function ($event, node) {
            node.collapsed = true;
            options.onCollapse($event, node, $scope.context);
        };

        $scope.selectNode = function ($event, node) {
            $scope.context.selectedNode = node;
            options.onSelect($event, node, $scope.context);
        };

        $scope.dblClick = function ($event, node) {
            options.onDblClick($event, node, $scope.context);
        };

        var options = fillOptions($scope.options);
        $scope.node = createRootNode($scope.model);
        $scope.context.nodify = function (node, parent) {
            return YaTreeviewService.nodify(node, parent, options);
        };
        $scope.context.nodifyArray = function (nodes, parent) {
            return YaTreeviewService.nodifyArray(nodes, parent, options);
        };
        $scope.context.children = function (node) {
            return YaTreeviewService.children(node, options);
        };

        $scope.$watch('model', function (newValue) {
            var root = createRootNode(newValue);
            for(var i in root) {
                if(root.hasOwnProperty(i)) {
                    $scope.node[i] = root[i];
                }
            }
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
            scope: false,
            templateUrl: 'templates/ya-treeview/children.tpl.html',
            compile: function (tElement) {
                var template = tElement.clone();
                tElement.empty();
                return function (scope, iElement) {
                    if (scope.node.$hasChildren) {
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