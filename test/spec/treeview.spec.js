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

    it('should create a separate view', function () {
        expect(scope.view).not.toBe(scope.model);
    });

    it('should create a separate view with $model property on each node', function () {
        expect(scope.view[0].$model).toBe(scope.model[0]);
        expect(scope.view[2].$model).toBe(scope.model[2]);
        expect(scope.view[0].$children[0].$model).toBe(scope.model[0].children[0]);
    });

    it('should create a separate view with $parent property on each node', function () {
        expect(scope.view[0].$parent).toBeNull();
        expect(scope.view[0].$children[0].$parent).toBe(scope.model[0]);
        expect(scope.view[1].$children[0].$children[0].$parent).toBe(scope.model[1].children[0]);
    });

    it('should create a separate view with $root property on each node', function () {
        expect(scope.view[0].$root).toBeNull();
        expect(scope.view[0].$children[0].$root).toBe(scope.model[0]);
        expect(scope.view[1].$children[0].$children[0].$root).toBe(scope.model[1]);
    });

    it('should create a separate view with $children property on each node with children', function () {
        expect(scope.view[0].$children.length).toBe(1);
        expect(scope.view[0].$children[0].$children).toBeUndefined();
    });
});
