const todoController = (app, database) => {
    app.get(`/api/todos`, (req, res) => {
        res.send(database.todos);
    });
    app.get(`/api/todos/:id`, (req, res) => {
        res.send(database.todos.find(({ id }) => id === parseInt(req.params['id'], 10)));
    });  
};

module.exports = { todoController };