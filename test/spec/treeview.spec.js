'use strict';

describe('YaTreeviewCtrl', function () {

    // load the controller's module
    beforeEach(module('ya.treeview'));

    var scope, ctrl;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        scope.model = [
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
        ctrl = $controller('YaTreeviewCtrl', {$scope: scope})
    }));

    it('should not use the model directly', function () {
        expect(scope.view).not.toBe(scope.model);
    });
});
