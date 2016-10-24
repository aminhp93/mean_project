app.controller('userController', function($scope, $http, userFactory, $location, $cookies, Facebook) {
    function getUser(data) {
        $scope.users = data;

        if (!$scope.users.errors) {

        }
    }

    userFactory.getUser(getUser);

    $scope.createUser = function() {
        userFactory.createUser($scope.user, getUser);
        $scope.user = {};
        $location.url('/dashboard');
    }




    // $scope.accounts = [];
    // $scope.totalUsers = 0;
    // $scope.userPerPage = 10;
    // $scope.pagination = {
    //     current: 1
    // }

    // $scope.pageChanged = function(newPage) {
    //     getResultsPage(newPage);
    // }

    // function getUserFromGit(pageNumber) {
    //     pageNumber *= $scope.userPerPage;
    //     $http.get('https://api.github.com/users?since=' + pageNumber).then(function(result) {
    //         $scope.accounts = result.data;
    //         $scope.total = result.data.length;

    //     })
    // }
    // getUserFromGit(0);


    // $scope.checkLoginState = function() {
    //     console.log('1');
    //     FB.getLoginStatus(function(response) {
    //         console.log('2');
    //         if (response.status === 'connected') {
    //             console.log('3');
    //             userFactory.testAPI();
    //         }
    //     });
    // }


    // $scope.login = function() {
    //     // From now on you can use the Facebook service just as Facebook api says
    //     Facebook.login(function(response) {
    //         // Do something with response.
    //     });
    // };

    // $scope.getLoginStatus = function() {
    //     console.log(Facebook);
    //     Facebook.getLoginStatus(function(response) {
    //         console.log(response);
    //         if (response.status === 'connected') {
    //             $scope.loggedIn = true;
    //         } else {
    //             $scope.loggedIn = false;
    //         }
    //     });
    // };

    // $scope.me = function() {
    //     Facebook.api('/me', function(response) {
    //         $scope.user = response;
    //     });
    // };

    // $scope.$watch(function() {
    //     // This is for convenience, to notify if Facebook is loaded and ready to go.
    //     return Facebook.isReady();
    // }, function(newVal) {
    //     // You might want to use this to disable/show/hide buttons and else
    //     $scope.facebookReady = true;
    // });


    $scope.loginStatus = 'disconnected';
    $scope.facebookIsReady = false;
    $scope.user = null;
    $scope.login = function() {
        Facebook.login(function(response) {
            console.log(response);
            $scope.loginStatus = response.status;
        });
    };
    // $scope.removeAuth = function() {
    //     Facebook.api({
    //         method: 'Auth.revokeAuthorization'
    //     }, function(response) {
    //         Facebook.getLoginStatus(function(response) {
    //             $scope.loginStatus = response.status;
    //         });
    //     });
    // };
    $scope.api = function() {
        Facebook.api('/me', function(response) {
            $scope.user = response;
            console.log(response);
        });
    };
    // $scope.$watch(function() {
    //     return Facebook.isReady();
    // }, function(newVal) {
    //     if (newVal) {
    //         $scope.facebookIsReady = true;
    //     }
    // });

})
