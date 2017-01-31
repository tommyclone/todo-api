var express = require('express');
var bodyParser = require('body-parser');
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
    var todo = todos.find(function(value, index){
        return value.id == todoId;
    });
    if (!todo) {
        res.status(404).json({ 
            error: 'todo not found.'
        });
    }
    res.json(todo);
});

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

// POST /todos
app.post('/todos', function(req, res) {
    var body = req.body;
    var newTodo = {        
        id: todoNextId++,
        description: body.description,
        completed: body.completed
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
    
});

app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});
