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
        User.create(request.body, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.redirect('/users');
            }
        })
    }
}
