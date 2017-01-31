var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// GET /todos
app.get('/todos', function(req, res){
    res.json(todos);
});
// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var todo = _.findWhere(todos, {id: todoId});
    if (!todo) {
        return res.status(404).json({ 
            error: 'todo not found.'
        });
    }
    res.json(todo);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var todo = _.findWhere(todos, {id: todoId});
    if (!todo) {
        return res.status(404).json({ 
            error: 'todo not found.'
        });
    }
    todos = _.without(todos, todo);
    res.json(todo);
});

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res){

    var todoId = parseInt(req.params.id, 10);
    var todo = _.findWhere(todos, {id: todoId});
    if (!todo) {
        return res.status(404).json({ 
            error: 'todo not found.'
        });
    }

    var body = req.body;
    body = _.pick(body, 'description', 'completed');
    var validAttributes = {};
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if(body.hasOwnProperty('completed')) {
        return res.status(400).json({"error": "completed attribute must be boolean"});
    }
    else {}

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if(body.hasOwnProperty('description')) {
        return res.status(400).json({"error": "description attribute must non-empty string"});
    }
    else {}

    todo = _.extend(todo, validAttributes)

    res.json(todo);
})
// POST /todos
app.post('/todos', function(req, res) {
    var body = req.body;
    body = _.pick(body, 'description', 'completed');
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
            return res.status(400).send();
    }
    body.description = body.description.trim();
    body.id = todoNextId++;
    todos.push(body);
    res.status(201).json(body);
    
});

app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});
