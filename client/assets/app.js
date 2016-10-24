var app = angular.module('app', ['ngRoute', 'ngCookies', 'angularUtils.directives.dirPagination', 'ezfb']);

app.config(function($routeProvider, ezfbProvider) {
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

    ezfbProvider.setInitParams({
        appId: '198459453897675',

        version: 'v2.3'
    });

})
