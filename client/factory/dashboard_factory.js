app.factory('dashboardFactory', function($http) {
    var factory = {};
    var users = [];

    factory.getUser = function(callback) {
        $http.get('/users').then(function(result) {
            users = result.data;
            callback(users);
        })
    }

    factory.createUser = function(user) {
        $http.post('/users', user)
    }

    factory.getOneUser = function(id, callback) {
        $http.get('/users/' + id).then(function(result) {
            users = result.data;
            callback(users);
        })
    }

    factory.updatePosition = function(user) {
        $http.post('/users/position', user).then(function(result) {

        })
    }

    return factory;
})
