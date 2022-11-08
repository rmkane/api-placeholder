const albumController = (app, database) => {
    app.get(`/api/albums`, (req, res) => {
        res.send(database.albums);
    });
    app.get(`/api/albums/:id`, (req, res) => {
        res.send(database.albums.find(({ id }) => id === parseInt(req.params['id'], 10)));
    });
    app.get('/api/albums/:id/photos', (req, res) => {
        res.send(database.photos.filter(({ albumId }) => albumId === parseInt(req.params['id'], 10)));
    });
};

module.exports = albumController;