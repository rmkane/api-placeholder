const todoController = (app, database) => {
    const findById = (id) =>
        database.todos.find((todo) => todo.id === id);
        
    app.get(`/api/todos`, (req, res) => {
        res.send(database.todos);
    });

    app.get(`/api/todos/:id`, (req, res) => {
        res.send(findById(+req.params.id));
    });

    app.post('/api/todos', (req, res) => {
        const {
            completed = false,
            title = '',
            userId = database.users[0].id
        } = req.body ?? {};
        const newPost = {
            completed,
            id: database.todos.length + 1,
            title,
            userId
        };
        res.send(newPost);
    });

    app.put(`/api/todos/:id`, (req, res) => {
        const existingTodo = findById(+req.params.id);
        if (!existingTodo) {
            res.status(404).send({
                message: `Todo with id ${req.params.id} does not exist`
            });
            return;
        }
        const {
            completed = false,
            id,
            title = '',
            userId = ''
        } = req.body ?? {};
        if (id == null || id !== +req.params.id) {
            res.status(400).send({
                message: `The provided id '${id}' does not match '${req.params['id']}'`
            });
            return;
        }
        const replacedTodo = {
            completed,
            id,
            title,
            userId
        };
        res.send(replacedTodo);
    });

    app.patch(`/api/todos/:id`, (req, res) => {
        const existingTodo = findById(+req.params.id);
        if (!existingTodo) {
            res.status(404).send({
                message: `Todo with id ${req.params.id} does not exist`
            });
            return;
        }
        const {
            completed = existingTodo?.completed ?? '',
            id = existingTodo.id,
            title = existingTodo?.title ?? '',
            userId = existingTodo?.userId ?? '',
        } = req.body ?? {};
        if (id == null || id !== +req.params.id) {
            res.status(400).send({
                message: `The provided id '${id}' does not match '${req.params['id']}'`
            });
            return;
        }
        const updatedTodo = {
            completed,
            id,
            title,
            userId,
        };
        res.send(updatedTodo);
    });

    app.delete('/api/todos/:id', (req, res) => {
        const existingTodo = findById(+req.params.id);
        if (!existingTodo) {
            res.status(404).send({
                message: `Todo with id ${req.params.id} does not exist`
            });
            return;
        }

        res.status(200).send({
            message: 'Todo successfully deleted'
        });
    });
};

module.exports = todoController;