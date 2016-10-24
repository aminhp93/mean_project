var app = angular.module('app', ['ngRoute', 'ngCookies', 'angularUtils.directives.dirPagination', 'facebook']);

app.config(function($routeProvider, FacebookProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/index.html',
                controller: 'userController'
            })
            .when('/dashboard', {
                templateUrl: 'partials/dashboard.html',
                controller: 'userController'
            })
            .otherwise({
                redirectTo: '/'
            })
        FacebookProvider.init('198459453897675');

    })
    // window.fbAsyncInit = function() {
    //     FB.init({
    //         appId: '198459453897675',
    //         xfbml: true,
    //         version: 'v2.8'
    //     });
    // };

// (function(d, s, id) {
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) {
//         return;
//     }
//     js = d.createElement(s);
//     js.id = id;
//     js.src = "//connect.facebook.net/en_US/sdk.js";
//     fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));

// function checkLoginState() {
//     FB.getLoginStatus(function(response) {
//         if (response.status === "connected") {
//             testAPI();
//         }
//     });
// }

// function testAPI() {
//     FB.api('/me', function(response) {
//         console.log('Successful login for: ' + response.name);
//     });
// }
