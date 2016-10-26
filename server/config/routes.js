var users = require('../controllers/users.js');

module.exports = function(app) {
    app.get('/users', users.index);
    app.get('/users/:id', users.getOne);
    app.post('/users', users.create);
    app.post('/addP/edit/:id', function(req, res) {
  	profiles.addP(req, res);
  	})
}
