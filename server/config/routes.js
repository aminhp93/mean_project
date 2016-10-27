var users = require('../controllers/users.js');

module.exports = function(app) {
    app.get('/users', users.index);
    app.get('/users/:id', users.getOne);
    app.post('/users', users.create);
    app.post('/users/position/update', users.updatePosition);
    app.post('/users/position/delete', users.deletePosition);
    app.post('/addP/edit/:id', users.editProfile);
}
