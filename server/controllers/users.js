var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
    create: function(request, response) {
        User.create(request.body, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                response.json(result);
            }
        })
    }
}
