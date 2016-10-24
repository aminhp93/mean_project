app.factory('userFactory', function($http) {
    var factory = {};
    var users = [];

    factory.getUser = function(callback) {
        $http.get('/users').then(function(result) {
            users = result.data;
            callback(users);
        })
    }

    factory.createUser = function(user, callback) {
        // $http.post('/users', user).then(function(result) {
        //     users = result.data;
        //     callback(users);
        // })
    }
    factory.create = function(user) {
        $http.post('/users', user)
    }

    return factory;
})
