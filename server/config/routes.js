var users = require('../controllers/users.js');

module.exports = function(app) {
    app.post('/users', users.create);
}
