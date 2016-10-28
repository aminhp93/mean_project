var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
    index: function(request, response) {
        User.find({}, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        })
    },
    create: function(request, response) {

        User.remove({ facebook_id: request.body.facebook_id }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                User.create(request.body, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        response.redirect("/users");
                    }
                })
            }
        })
    },
    getOne: function(request, response) {
        User.find({ _id: request.params.id }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        })
    },
    updatePosition: function(request, response) {
        User.findOne({ facebook_id: request.body.facebook_id }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                if (result != null) {
                    result.lat = request.body.lat;
                    result.lon = request.body.lon;
                    result.save(function(err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                    response.redirect('/users');
                }
            }
        })
    },
    deletePosition: function(request, response) {
        User.findOne({ facebook_id: request.body.facebook_id }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                if (result != null) {
                    result.lat = 0;
                    result.lon = 0;
                    result.save(function(err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                    response.redirect('/users');
                }
            }
        })
    },
    editProfile: function(request, response) {
        console.log("=============================")
        console.log(request.body);
        User.find({ _id: request.params.id }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                if (result.length == 1) {
                    console.log("=============================1")

                    console.log(result);
                    request.body._id = result[0]._id;
                    request.body.facebook_id = result[0].facebook_id;
                    request.body.name = result[0].name;
                    request.body.image_url = result[0].image_url;
                    request.body.gender = result[0].gender;
                    request.body.age = result[0].age;
                    request.body.lat = result[0].lat;
                    request.body.lon = result[0].lon;
                    request.body.email = result[0].email;
                    console.log(result);
                    console.log("=============================2")

                    // request.body.save(function(err) {
                    //     if (err) {
                    //         console.log(err);
                    //     }
                    // })
                }
            }
        })
    }
}
