'use strict';

angular.module('app', ['ya.treeview', 'ya.treeview.breadcrumbs'])
    .controller('AppCtrl', function($scope, $http) {
        $scope.context = {
            selectedNodes: []
        };

        $scope.options = {
            onSelect: function($event, node, context) {
                if ($event.ctrlKey) {
                    var idx = context.selectedNodes.indexOf(node);
                    if (context.selectedNodes.indexOf(node) === -1) {
                        context.selectedNodes.push(node);
                    } else {
                        context.selectedNodes.splice(idx, 1);
                    }
                } else {
                    context.selectedNodes = [node];
                }
            }
        };

        $scope.load = function() {
            $http.get('data.json').success(function(data) {
                $scope.model = data;
            });
        };

        $scope.model = [{
            label: 'parent1',
            children: [{
                label: 'child'
            }]
        }, {
            label: 'parent2',
            children: [{
                label: 'child',
                children: [{
                    label: 'innerChild'
                }]
            }]
        }, {
            label: 'parent3'
        }];
    });
