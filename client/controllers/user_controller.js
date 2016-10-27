app.controller('userController', function($scope, $routeParams, $location, dashboardFactory, userFactory) {

    function getOneUser(data) {
        $scope.users = data;
    }

    dashboardFactory.getOneUser($routeParams.id, getOneUser);

    $scope.addprofile = function(id) {
        console.log($scope.new_profile);
        userFactory.addProfile(id, $scope.new_profile);
        $location.url("/");
    }

    dashboardFactory.getOneUser($routeParams.id, function(data) {
        $scope.profiles = data;
    })

})
