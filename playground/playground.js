var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1,250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync({
    // force: true
    }).then(function(){
        Todo.findById(3).then(function(todo){
            if (todo) {
                console.log(todo.toJSON());
            } else {
                console.log('Todo not found!');
            }
        });

    // console.log('Everything is synced');
    // Todo.create({
    //     description: 'hello',
    // }).then(function(todo){
    //     return Todo.create({
    //         description: 'super wash',
    //         completed: true
    //     });
    // }).then(function(todo){
    //     return Todo.findAll({
    //         where: {
    //             description: {
    //                 $like: '%e%'
    //             }
    //         }
    //     });
    // }).then(function(todos){
    //     todos.forEach(function(todo){
    //         console.log(todo.toJSON());
    //     }); 
    // }).catch(function(error){
    //     console.log(error);
    // });
});

