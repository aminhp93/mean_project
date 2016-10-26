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
                console.log(result);
                response.json(result);
            }
        })
    },
    updatePosition: function(request, response) {
        console.log(request.body);
        User.findOne({ facebook_id: request.body.facebook_id }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                result['latitude'] = request.body.latitude;
                result['longtitude'] = request.body.longtitude;
                console.log(result);
                result.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                })

            }
        })
    }
}
