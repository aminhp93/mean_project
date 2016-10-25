app.controller('userController', function($scope, $routeParams, dashboardFactory) {

    function getUser(data) {
        $scope.users = data;
    }

    dashboardFactory.getOneUser($routeParams.id, getUser);

})
