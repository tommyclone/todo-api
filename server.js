var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// GET /todos
app.get('/todos', function(req, res){
    var query = req.query;
    var where = {};
    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }
    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }
    db.todo.findAll({where: where}).then(function(todos){
        res.json(todos);
    }, function(e){
        res.status(500).json(e);
    });
    // var filterTodos = todos;
    // if (queryParams.hasOwnProperty('completed')) {
    //     if (queryParams.completed === 'true'){
    //         filterTodos = _.where(filterTodos, {completed: true});
    //     } else if (queryParams.completed === 'false') {
    //         filterTodos = _.where(filterTodos, {completed: false});
    //     }
    // }
    // if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    //     filterTodos = _.filter(filterTodos, function(item) {
    //         return ~item.description.toLowerCase().indexOf(queryParams.q.toLowerCase());
    //     });
    // }
    // res.json(filterTodos);
});
// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    db.todo.findById(todoId).then(function(todo){
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).json({'error': 'todo not found'});
        }
    }, function(e){
        res.status(500).json(e);
    });
    // var todo = _.findWhere(todos, {id: todoId});
    // if (!todo) {
    //     return res.status(404).json({ 
    //         error: 'todo not found.'
    //     });
    // }
    // res.json(todo);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function(rowsDeleted){
        if (rowsDeleted === 0) {
            res.status(404).json({'error': 'todo not found'});
        } else {
            res.status(204).send();
        }
    }, function(e) {
        res.status(500).json(e);
    });
});

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res){

    var todoId = parseInt(req.params.id, 10);
    var body = req.body;
    body = _.pick(body, 'description', 'completed');
    var attributes = {};

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }
    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }
    db.todo.findById(todoId).then(function(todo){
        if (todo) {
            return todo.update(attributes);
        } else {
            res.status(404).json({'error': 'todo not found!'});
        }
    }, function (e) {
        res.status(500).json(e);
    }).then(function (todo) {
        res.json(todo.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });

})

// POST /todos
app.post('/todos', function(req, res) {
    var body = req.body;
    body = _.pick(body, 'description', 'completed');
    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }, function (error){
        res.status(400).json(e);

    });
    // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    //         return res.status(400).send();
    // }
    // body.description = body.description.trim();
    // body.id = todoNextId++;
    // todos.push(body);
    // res.status(201).json(body);
    
});

app.post('/users', function(req, res){
    var body = _.pick(req.body, 'email', 'password');

    db.user.create(body).then(function(user){
        res.json(user.toJSON());
    }, function(e){
        res.status(400).json(e);
    });
});

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT + '!');
    });
});


