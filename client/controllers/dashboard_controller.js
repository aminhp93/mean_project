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

                    $scope.result = [];
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
                        if (navigator.geolocation) {
                            console.log("amin");

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
        console.log('logout1')
        ezfb.logout(function(res) {
            updateLoginStatus(updateApiMe);
            info = { 'facebook_id': $cookies.get('user_id') }
            dashboardFactory.deletePosition(info, getUser);
            $cookies.remove('user_id');
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
        if (navigator.geolocation) {
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
    $scope.music = function() {
        var mySound, myOscillator, myGain, myDistortion, originalYPos, originalFrequency, scaleFrequencies = [110, 123.47, 130.81, 146.83, 164.81, 174.61, 196, 220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.50, 1174.66, 1318.51, 1396.91, 1567.98, 1760],
            appNode = document.getElementById('music'),
            appWidth = appNode.offsetWidth,
            appHeight = appNode.offsetHeight,
            mouseXpos = window.clientX,
            mouseYpos = window.clientY;

        appNode.style.background = 'repeating-linear-gradient(to right, #FDF6E4, #FDF6E4 50%, #F7EFD7 50%, #F7EFD7)';
        appNode.style.backgroundSize = ((appWidth / scaleFrequencies.length) * 2) + 'px 100%';
        var contextClass = (window.AudoContext || window.webkitAudioContext);


        function makeDistortionCurve(amount) {
            var k = typeof amount === 'number' ? amount : 50,
                n_samples = 44100,
                curve = new Float32Array(n_samples),
                deg = Math.PI / 180,
                i = 0,
                x;
            for (; i < n_samples; ++i) {
                x = i * 2 / n_samples - 1;
                curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
            }
            return curve;
        }; // look up from mozilla


        if (contextClass) {
            mySound = new contextClass();
        } else {
            document.getElementById('music').innerHTML = '<div class="container alert alert-danger" role="alert">Sorry not supported</div>';
        }

        appNode.addEventListener('mousedown', function(e) {
            mouseXpos = e.clientX;
            mouseYpos = e.clientY;
            originalYPos = mouseYpos;

            myOscillator = mySound.createOscillator();
            myOscillator.type = 'sine'; // sine square sawtooth triangle

            originalFrequency = scaleFrequencies[Math.floor((mouseXpos / appWidth) * scaleFrequencies.length)]; // devide into diffrent sounds

            myOscillator.frequency.value = originalFrequency;
            myOscillator.start();

            myDistortion = mySound.createWaveShaper();
            myDistortion.curve = makeDistortionCurve(400);
            myDistortion.oversample = '4x';

            myGain = mySound.createGain();
            myGain.gain.value = 0.7; // the the volume

            myOscillator.connect(myDistortion);
            myDistortion.connect(myGain);
            myGain.connect(mySound.destination);

            appNode.addEventListener('mousemove', function(e) {
                var distanceY = e.clientY - originalYPos;
                mouseXpos = e.clientX;
                appWidth = appNode.offsetWidth;

                myGain.gain.value = mouseXpos / appWidth;
                myOscillator.frequency.value = originalFrequency + distanceY;
            }, false);
        }, false);

        appNode.addEventListener('mouseup', function(e) {
            myOscillator.stop();
            appNode.removeEventListener('mousemove');
        }, false);

    }
})
