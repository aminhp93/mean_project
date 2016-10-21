app.factory('userFactory', function($http) {
    var factory = {};
    var users = [];

    factory.createUser = function(user, callback) {
        $http.post('/users', user).then(function(result) {
            users = result.data;
            callback(users);
        })
    }

    return factory;
})
