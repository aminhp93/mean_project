app.factory('dashboardFactory', function($http, $rootScope) {
    var factory = {};
    var users = [];

    factory.getUser = function(callback) {
        $http.get('/users').then(function(result) {
            users = result.data;
            callback(users);
        })
    }

    factory.createUser = function(user, callback) {
        $http.post('/users', user).then(function(result) {
            users = result.data;
            callback(users);
        })
    }

    factory.getOneUser = function(id, callback) {
        $http.get('/users/' + id).then(function(result) {
            users = result.data;
            callback(users);
        })
    }

    factory.updatePosition = function(info, callback) {
        $http.post('/users/position/update', info).then(function(result) {
            users = result.data;
            callback(users);
        })
    }

    factory.deletePosition = function(info, callback) {
        $http.post('/users/position/delete', info).then(function(result) {
            users = result.data;
            callback(users);
        })
    }
    return factory;
})
