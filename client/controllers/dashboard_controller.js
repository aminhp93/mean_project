app.controller('dashboardController', function($scope, dashboardFactory, $location, $cookies, ezfb, socket) {
    function getUser(data) {
        $scope.users = data;
    }

    dashboardFactory.getUser(getUser);

    updateLoginStatus(updateApiMe);

    $scope.login = function() {
        ezfb.login(function(res) {
            if (res.authResponse) {
                updateLoginStatus(updateApiMe);

                ezfb.api('/me', function(response1) {
                    $cookies.put("user_id", response1.id);
                    ezfb.api('/' + response1.id + '?fields=picture,age_range,email,gender', function(response2) {
                        info = { 'facebook_id': response1.id, 'name': response1.name, 'image_url': response2.picture.data.url, 'email': response2.email, 'age_range': response2.age_range.min, 'gender': response2.gender }
                        dashboardFactory.createUser(info, getUser);
                    })
                });
            }
        }, { scope: 'email,user_likes' });
    };

    $scope.logout = function() {
        ezfb.logout(function(res) {
            updateLoginStatus(updateApiMe);
        });
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

    function updateLoginStatus(more) {
        ezfb.getLoginStatus(function(res) {
            $scope.loginStatus = res;
            (more || angular.noop)();
        });
    }

    function updateApiMe() {
        ezfb.api('/me', function(res) {
            $scope.apiMe = res;
        });
    }

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


    // =========================================================================
    //                                 SOCKET.IO
    // =========================================================================


})
