var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: 'Meet mum for lunch',
    completed: false
}, {
    id: 2,
    description: 'Go to market',
    completed: false,
}, {
    id: 3,
    description: 'Feed cat',
    completed: true
}];

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

app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});
