var users = require('../controllers/users.js');

module.exports = function(app) {
    app.get('/users', users.index);
    app.get('/users/:id', users.getOne);
    app.post('/users', users.create);
<<<<<<< HEAD
    app.post('/users/position', users.updatePosition);

    app.post('/addP/edit/:id', function(req, res) {
        profiles.addP(req, res);
    })
=======
    app.post('/users/position/update', users.updatePosition);
    app.post('/users/position/delete', users.deletePosition);
    app.post('/addP/edit/:id', users.editProfile);
>>>>>>> b5
}
