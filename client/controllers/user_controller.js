app.controller('userController', function($scope, userFactory, $location, $cookies) {
    function getUser(data) {
        $scope.users = data;

        if (!$scope.users.errors) {
            $scope.user = {};
            $location.url('/');
        }
    }

    $scope.createUser = function() {
        userFactory.createUser($scope.user, getUser);
    }
})
