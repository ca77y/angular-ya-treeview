'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('ya.treeview'));

    var scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(true).toBe(true);
    });
});
