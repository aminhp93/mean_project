app.controller('userController', function($scope, $http, userFactory, $location, $cookies, ezfb) {
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


    updateLoginStatus(updateApiMe);
    console.log(ezfb);

    $scope.login = function() {
        /**
         * Calling FB.login with required permissions specified
         * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
         */
        ezfb.login(function(res) {
            /**
             * no manual $scope.$apply, I got that handled
             */
            if (res.authResponse) {
                updateLoginStatus(updateApiMe);
            }
            ezfb.api('/me', function(response1) {
                $scope.user = response1;
                ezfb.api('/' + response1.id + '?fields=picture,age_range,email,gender,current_city', function(response2) {
                    console.log(response2);
                    info = { 'name': response1.name, 'image_url': response2.picture.data.url, 'email': response2.email, 'age_range': response2.age_range.min }
                    userFactory.create(info);
                })

                ezfb.api('/' + response1.id + "?fields=friends", function(response) {
                    console.log(response);
                })

                ezfb.api('/me/likes', function(res) {
                    console.log('Minh');
                    console.log(res);
                })
            });
        }, { scope: 'email,user_likes' });
    };

    $scope.logout = function() {
        /**
         * Calling FB.logout
         * https://developers.facebook.com/docs/reference/javascript/FB.logout
         */
        ezfb.logout(function() {
            updateLoginStatus(updateApiMe);
        });
    };

    $scope.share = function() {
        ezfb.ui({
                method: 'feed',
                name: 'angular-easyfb API demo',
                picture: 'http://plnkr.co/img/plunker.png',
                link: 'http://plnkr.co/edit/qclqht?p=preview',
                description: 'angular-easyfb is an AngularJS module wrapping Facebook SDK.' +
                    ' Facebook integration in AngularJS made easy!' +
                    ' Please try it and feel free to give feedbacks.'
            },
            function(res) {
                // res: FB.ui response
            }
        );
    };

    /**
     * For generating better looking JSON results
     */
    var autoToJSON = ['loginStatus', 'apiMe'];
    angular.forEach(autoToJSON, function(varName) {
        $scope.$watch(varName, function(val) {
            $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
        }, true);
    });

    /**
     * Update loginStatus result
     */
    function updateLoginStatus(more) {
        ezfb.getLoginStatus(function(res) {
            $scope.loginStatus = res;

            (more || angular.noop)();
        });
    }

    /**
     * Update api('/me') result
     */
    function updateApiMe() {
        ezfb.api('/me', function(res) {
            $scope.apiMe = res;
        });
    }



})
