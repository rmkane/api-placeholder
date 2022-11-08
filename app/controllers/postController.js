const postController = (app, database) => {
    const findById = (id) =>
        database.posts.find((post) => post.id === id);

    const findPostsByUserId = (userId) =>
        database.posts.filter((post) => post.userId === userId);
    
    const findCommentsByPostId = (postId) =>
        database.comments.filter((comments) => comments.postId === postId);

    app.get('/api/posts', (req, res) => {
        if (req.query.userId) {
            res.send(findPostsByUserId(+req.query.userId));
        } else {
            res.send(database.posts);
        }
    });

    app.get(`/api/posts/:id`, (req, res) => {
        res.send(findById(+req.params.id));
    });

    app.get('/api/posts/:id/comments', (req, res) => {
        res.send(findCommentsByPostId(+req.params.id));
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
        const existingPost = findById(+req.params.id);
        if (!existingPost) {
            res.status(404).send({
                message: `Post with id ${req.params.id} does not exist`
            });
            return;
        }
        const {
            id,
            title = '',
            body = '',
            userId = '',
        } = req.body ?? {};
        if (id == null || id !== +req.params.id) {
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
        const existingPost = findById(+req.params.id);
        if (!existingPost) {
            res.status(404).send({
                message: `Post with id ${req.params.id} does not exist`
            });
            return;
        }
        const {
            id = existingPost.id,
            title = existingPost?.title ?? '',
            body = existingPost?.body ?? '',
            userId = existingPost?.userId ?? '',
        } = req.body ?? {};
        if (id == null || id !== +req.params.id) {
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
        const existingPost = findById(+req.params.id);
        if (!existingPost) {
            res.status(404).send({
                message: `Post with id ${req.params.id} does not exist`
            });
            return;
        }

        res.status(200).send({
            message: 'Post successfully deleted'
        });
    });
};

module.exports = postController;