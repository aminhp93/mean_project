app.controller('dashboardController', function($scope, dashboardFactory, $location, $cookies, ezfb) {
    function getUser(data) {
        $scope.users = data;
    }

    dashboardFactory.getUser(getUser);

    updateLoginStatus(updateApiMe);

    function showPosition(position) {
        console.log(position.coords.latitude, position.coords.longitude)
    }

    $scope.login = function() {

        ezfb.login(function(res) {
            if (res.authResponse) {
                updateLoginStatus(updateApiMe);
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }

            ezfb.api('/me', function(response1) {
                $scope.user = response1;
                ezfb.api('/' + response1.id + '?fields=picture,age_range,email,gender', function(response2) {
                    info = { 'name': response1.name, 'image_url': response2.picture.data.url, 'email': response2.email, 'age_range': response2.age_range.min, 'gender': response2.gender }
                    dashboardFactory.create(info);
                })
            });
        }, { scope: 'email,user_likes' });
    };

    $scope.logout = function() {
        /**
         * Calling FB.logout
         * https://developers.facebook.com/docs/reference/javascript/FB.logout
         */
        ezfb.logout(function(res) {
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

    // =========================================================================
    //                                 PAGINATION
    // =========================================================================

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


})
