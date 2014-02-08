angular.module('app', ['ya.treeview'])
    .controller('AppCtrl', function ($scope, $http) {
        $scope.options = {
            context: {
                selectedNodes: []
            },
            onSelect: function ($event, node, context) {
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

        $http.get('data.json')
            .success(function (data) {
                $scope.model = data;
            });
    });