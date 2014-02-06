angular.module('app', ['ya.treeview'])
    .controller('AppCtrl', function ($scope, $http) {
        $http.get('data.json')
            .success(function (data) {
                $scope.model = data;
            });
    });