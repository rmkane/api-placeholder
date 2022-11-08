const commentController = (app, database) => {
    const findById = (id) =>
        database.comments.find((comment) => comment.id === id);
    
    const findByPostId = (postId) =>
        database.comments.filter((comment) => comment.postId === postId);
    
    app.get('/api/comments', (req, res) => {
        if (req.query.postId) {
            res.send(findByPostId(+req.query.postId));
        } else {
            res.send(database.comments);
        }
    });

    app.get(`/api/comments/:id`, (req, res) => {
        res.send(findById(+req.params.id));
    });

    app.post('/api/comments', (req, res) => {
        const {
            body = '',
            email = '',
            name = '',
            postId = database.posts[0].id,
        } = req.body ?? {};
        const newComment = {
            body,
            email,
            id: database.comments.length + 1,
            name,
            postId,
        };
        res.send(newComment);
    });

    app.put(`/api/comments/:id`, (req, res) => {
        const existingComment = findById(+req.params.id);
        if (!existingComment) {
            res.status(404).send({
                message: `Comment with id ${req.params.id} does not exist`
            });
            return;
        }
        const {
            body = '',
            email = '',
            id,
            name = '',
            postId = '',
        } = req.body ?? {};
        if (id == null || id !== +req.params.id) {
            res.status(400).send({
                message: `The provided id '${id}' does not match '${req.params.id}'`
            });
            return;
        }
        const replacedComment = {
            body,
            email,
            id,
            name,
            postId
        };
        res.send(replacedComment);
    });

    app.patch(`/api/comments/:id`, (req, res) => {
        const existingComment = findById(+req.params.id);
        if (!existingComment) {
            res.status(404).send({
                message: `Comment with id ${req.params.id} does not exist`
            });
            return;
        }
        const {
            body = existingComment?.body ?? '',
            email = existingComment?.email ?? '',
            id,
            name = existingComment?.name ?? '',
            postId = existingComment?.postId ?? '',

        } = req.body ?? {};
        if (id == null || id !== +req.params.id) {
            res.status(400).send({
                message: `The provided id '${id}' does not match '${req.params.id}'`
            });
            return;
        }
        const updatedComment = {
            body,
            email,
            id,
            name,
            postId
        };
        res.send(updatedComment);
    });

    app.delete('/api/comments/:id', (req, res) => {
        const existingComment = findById(+req.params.id);
        if (!existingComment) {
            res.status(404).send({
                message: `Comment with id ${req.params.id} does not exist`
            });
            return;
        }

        res.status(200).send({
            message: 'Comment successfully deleted'
        });
    });
};

module.exports = commentController;