const photoController = (app, database) => {
    app.get(`/api/photos`, (req, res) => {
        res.send(database.photos);
    });
    app.get(`/api/photos/:id`, (req, res) => {
        res.send(database.photos.find(({ id }) => id === parseInt(req.params['id'], 10)));
    });
};

module.exports = photoController;