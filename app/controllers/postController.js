const postController = (app, database) => {
    app.get('/api/posts', (req, res) => {
        if (req.query['userId']) {
            res.send(database.posts.filter(({ userId }) => userId === parseInt(req.query['userId'], 10)));
        } else {
            res.send(database.posts);
        }
    });
    app.get(`/api/posts/:id`, (req, res) => {
        res.send(database.posts.find(({ id }) => id === parseInt(req.params['id'], 10)));
    });
    app.get('/api/posts/:id/comments', (req, res) => {
        res.send(database.comments.filter(({ postId }) => postId === parseInt(req.params['id'], 10)));
    });
    app.post('/api/posts', (req, res) => {
        const {
            title = '',
            body = '',
            userId = database.users[0].id
        } = req.body ?? {};
        const newPost = {
            body,
            id: database.posts.length + 1,
            title,
            userId,
        };
        res.send(newPost);
    });
    app.put(`/api/posts/:id`, (req, res) => {
        const existingPost = database.posts.find(({ id }) => id === parseInt(req.params['id'], 10));
        if (!existingPost) {
            res.status(404).send({
                message: `Post with id ${req.params['id']} does not exist`
            });
            return;
        }
        const {
            id,
            title = '',
            body = '',
            userId = '',
        } = req.body ?? {};
        if (id == null || id !== parseInt(req.params['id'], 10)) {
            res.status(400).send({
                message: `The provided id '${id}' does not match '${req.params['id']}'`
            });
            return;
        }
        const replacedPost = {
            body,
            id,
            title,
            userId,
        };
        res.send(replacedPost);
    });
    app.patch(`/api/posts/:id`, (req, res) => {
        const existingPost = database.posts.find(({ id }) => id === parseInt(req.params['id'], 10));
        if (!existingPost) {
            res.status(404).send({
                message: `Post with id ${req.params['id']} does not exist`
            });
            return;
        }
        const {
            id = existingPost.id,
            title = existingPost?.title ?? '',
            body = existingPost?.body ?? '',
            userId = existingPost?.userId ?? '',
        } = req.body ?? {};
        if (id == null || id !== parseInt(req.params['id'], 10)) {
            res.status(400).send({
                message: `The provided id '${id}' does not match '${req.params['id']}'`
            });
            return;
        }
        const updatedPost = {
            body,
            id,
            title,
            userId,
        };
        res.send(updatedPost);
    });
    app.delete('/api/posts/:id', (req, res) => {
        const existingPost = database.posts.find(({ id }) => id === parseInt(req.params['id'], 10));
        if (existingPost) {
            res.status(200).send({
                message: 'Post successfully deleted'
            });
        } else {
            res.status(404).send({
                message: `Post with id ${req.params['id']} does not exist`
            });
        }
    });
};

module.exports = postController;