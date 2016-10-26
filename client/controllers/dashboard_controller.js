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

                // $('#users_count').css('display', 'inline-block')
                // $('#map').css('display', 'inline-block')

                ezfb.api('/me', function(response1) {
                    $cookies.put("user_id", response1.id);
                    ezfb.api('/' + response1.id + '?fields=picture,age_range,email,gender', function(response2) {
                        info = { 'facebook_id': response1.id, 'name': response1.name, 'image_url': response2.picture.data.url, 'email': response2.email, 'age_range': response2.age_range.min, 'gender': response2.gender }
                        dashboardFactory.createUser(info);
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


    // =========================================================================
    //                                 SOCKET.IO
    // =========================================================================

    check_pos = setInterval(function() {
        if (typeof pos != 'undefined') {
            socket.emit('new_user', {
                pos: pos,
                user_id: $cookies.get('user_id')
            });
            clearInterval(check_pos);
        }
    }, 500);

    socket.on('already', function(data) {
        $.each(data.visiters, function(key, pos) {
            addMarker(pos);
        })
    })

    socket.on('connected', function(data) {
        $('#users_count').html(data.users_count + 'connected users');
        $('#users_count').css({
            'visibility': 'visible'
        });
        addMarker(data.pos);
    })

    socket.on('disconnected', function(data) {
        var markerId = getMarkerUniqueId(data.del.lat, data.del.lng);
        var marker = markers[markerId];
        removeMarker(marker, markerId);
        $('#users_count').html(data.users_count + 'connected users');
    })


})
