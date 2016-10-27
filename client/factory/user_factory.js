app.factory('userFactory', function($http) {
    console.log("users factory loaded");
    var factory = {};

    factory.addProfile = function(id, info) {
        console.log(id, info);
        $http.post('/addP/edit/' + id, info)
    }

    return factory;
})
