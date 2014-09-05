(function(exports, global) {
    global["true"] = exports;
    "use strict";
    angular.module("ya.treeview.breadcrumbs", []).directive("yaTreeviewBreadcrumbs", function() {
        return {
            restrict: "AE",
            replace: false,
            scope: {
                context: "=yaContext"
            },
            templateUrl: "templates/ya-treeview-breadcrumbs/breadcrumbs.tpl.html",
            controller: [ "$scope", function($scope) {
                $scope.navigateToCrumb = function(node) {
                    $scope.context.selectedNode = node;
                };
                $scope.$watch("context.selectedNode", function(node) {
                    $scope.crumbs = [ node ];
                    while (node && node.$parent) {
                        node = node.$parent;
                        $scope.crumbs.unshift(node);
                    }
                });
            } ]
        };
    });
    angular.module("ya.treeview.breadcrumbs.tpls", [ "templates/ya-treeview-breadcrumbs/breadcrumbs.tpl.html" ]);
    angular.module("templates/ya-treeview-breadcrumbs/breadcrumbs.tpl.html", []).run([ "$templateCache", function($templateCache) {
        $templateCache.put("templates/ya-treeview-breadcrumbs/breadcrumbs.tpl.html", '<ol class=breadcrumb><li ng-repeat="crumb in crumbs"><a ng-click=navigateToCrumb(crumb)>{{ crumb.$model.label }}</a></li></ol>');
    } ]);
})({}, function() {
    return this;
}());