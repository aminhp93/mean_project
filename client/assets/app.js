var app = angular.module('app', ['ngRoute', 'ngCookies', 'ezfb', 'ngMap']);

app.config(function($routeProvider, ezfbProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/index.html',
            controller: 'dashboardController'
        })
        .when('/users/:id', {
            templateUrl: 'partials/user.html',
            controller: 'userController'
        })
        .otherwise({
            redirectTo: '/'
        })

    ezfbProvider.setInitParams({
        appId: '198459453897675',

        version: 'v2.3'
    });

})
