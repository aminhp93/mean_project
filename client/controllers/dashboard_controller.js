app.controller('dashboardController', function($scope, dashboardFactory, $location, $cookies, ezfb, NgMap) {
    function getUser(data) {
        $scope.users = data;
        $scope.user = $cookies.get('name');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                }

                for (var i = 0; i < $scope.users.length; i++) {
                    if ($cookies.get('user_id') != $scope.users[i].facebook_id) {
                        var distance = calculateDistance($scope.users[i].lat, $scope.users[i].lon, pos.lat, pos.lon);
                        if (distance < 1) {
                            distance = distance.toFixed(3);
                            $scope.result = [$scope.users[i], distance];
                        }
                    }
                }
            })
        }
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295; // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;

        return 12742 * Math.asin(Math.sqrt(a));
    }

    dashboardFactory.getUser(getUser);

    updateLoginStatus(updateApiMe);

    $scope.login = function() {
        ezfb.login(function(res) {
            if (res.authResponse) {
                updateLoginStatus(updateApiMe);

                ezfb.api('/me', function(response1) {
                    $cookies.put("user_id", response1.id);
                    $cookies.put('name', response1.name);
                    ezfb.api('/' + response1.id + '?fields=picture,age_range,email,gender', function(response2) {
                        console.log(1);
                        if ("geolocation" in navigator) {
                            console.log(1);

                            navigator.geolocation.getCurrentPosition(function(position) {
                                console.log(1);

                                var c = position.coords;
                                info = { 'facebook_id': response1.id, 'name': response1.name, 'image_url': response2.picture.data.url, 'email': response2.email, 'age_range': response2.age_range.min, 'gender': response2.gender, 'lat': c.latitude, 'lon': c.longitude }
                                console.log(info);

                                dashboardFactory.createUser(info, getUser);
                                console.log(1);

                            });
                        }
                    })
                });
            }
        }, { scope: 'email,user_likes' });
    };

    $scope.logout = function() {
        ezfb.logout(function(res) {
            updateLoginStatus(updateApiMe);
            info = { 'facebook_id': $cookies.get('user_id') }
            dashboardFactory.deletePosition(info, getUser);
        });
    };

    $scope.share = function() {
        ezfb.ui({
                method: 'feed',
                name: 'by Chance',
                picture: '',
                link: 'localhost:8000',
                description: 'App 1'
            },
            function(res) {
                // res: FB.ui response
            }
        );
    }

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

    function init() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var c = position.coords;
                console.log(c);
                info = { 'facebook_id': $cookies.get('user_id'), 'lat': c.latitude, 'lon': c.longitude }
                dashboardFactory.updatePosition(info, getUser)
            });
        }
    }
    setInterval(function() {
        init();
    }, 5000);
})
