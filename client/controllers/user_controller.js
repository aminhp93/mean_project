app.controller('userController', function($scope, $routeParams, dashboardFactory, userFactory) {

    function getUser(data) {
        $scope.users = data;
    }

    function addProfile(data) {
        $scope.addprofile = function() {
            this.new_profile.name = $scope.name;
            userFactory.addProfile(this.new_profile, function(data) {
                userFactory.getOneUser(function(data) {
                    $scope.profiles = data;
                    this.new_profile = {};
                    $location.path('/users');
                })
            })
        }
        userFactory.getOneUser(function(data) {
            $scope.profiles = data;
        })
    }
})
