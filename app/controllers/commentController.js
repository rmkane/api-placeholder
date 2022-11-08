const commentController = (app, database) => {
    app.get('/api/comments', (req, res) => {
        if (req.query['postId']) {
            res.send(database.comments.filter(({ postId }) => postId === parseInt(req.query['postId'], 10)));
        } else {
            res.send(database.comments);
        }
    });
    app.get(`/api/comments/:id`, (req, res) => {
        res.send(database.comments.find(({ id }) => id === parseInt(req.params['id'], 10)));
    });
};

module.exports = { commentController };