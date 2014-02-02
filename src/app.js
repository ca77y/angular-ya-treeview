angular.module('app', ['ya.treeview'])
    .controller('AppCtrl', function ($scope) {
        $scope.model = [
            {
                label: 'parent1',
                children: [
                    {
                        label: 'child'
                    }
                ]
            },
            {
                label: 'parent2',
                children: [
                    {
                        label: 'child',
                        children: [
                            {
                                label: 'innerChild'
                            }
                        ]
                    }
                ]
            },
            {
                label: 'parent3'
            }
        ];
    });