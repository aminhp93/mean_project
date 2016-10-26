app.factory('userFactory', function($http) {
    console.log("users factory loaded");
    var factory = {};
    var users = [];

    factory.addProfile = function(info, callback) {
        $http.post('/addP/edit/:id', info).success(function(data) {
            callback(data);
        });
    }

    return factory;
})
