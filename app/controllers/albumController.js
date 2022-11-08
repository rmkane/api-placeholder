const albumController = (app, database) => {
    const findById = (id) =>
        database.albums.find((album) => album.id === id);

    const findPhotosByAlbumId = (id) =>
        database.photos.filter(({ albumId }) => albumId === id);

    app.get(`/api/albums`, (req, res) => {
        res.send(database.albums);
    });

    app.get(`/api/albums/:id`, (req, res) => {
        res.send(findById(+req.params.id));
    });

    app.get('/api/albums/:id/photos', (req, res) => {
        res.send(findPhotosByAlbumId(+req.params.id));
    });

    app.post('/api/albums', (req, res) => {
        const {
            title = '',
            userId = database.users[0].id
        } = req.body ?? {};
        const newAlbum = {
            id: database.albums.length + 1,
            title,
            userId,
        };
        res.send(newAlbum);
    });

    app.put(`/api/albums/:id`, (req, res) => {
        const existingAlbum = findById(+req.params.id);
        if (!existingAlbum) {
            res.status(404).send({
                message: `Album with id ${req.params.id} does not exist`
            });
            return;
        }
        const {
            id,
            title = '',
            userId = '',
        } = req.body ?? {};
        if (id == null || id !== +req.params.id) {
            res.status(400).send({
                message: `The provided id '${id}' does not match '${req.params.id}'`
            });
            return;
        }
        const replacedAlbum = {
            id,
            title,
            userId,
        };
        res.send(replacedAlbum);
    });

    app.patch(`/api/albums/:id`, (req, res) => {
        const existingAlbum = findById(+req.params.id);
        if (!existingAlbum) {
            res.status(404).send({
                message: `Album with id ${req.params.id} does not exist`
            });
            return;
        }
        const {
            id = existingAlbum.id,
            title = existingAlbum?.title ?? '',
            userId = existingAlbum?.userId ?? '',
        } = req.body ?? {};
        if (id == null || id !== +req.params.id) {
            res.status(400).send({
                message: `The provided id '${id}' does not match '${req.params.id}'`
            });
            return;
        }
        const updatedAlbum = {
            id,
            title,
            userId,
        };
        res.send(updatedAlbum);
    });

    app.delete('/api/albums/:id', (req, res) => {
        const existingAlbum = findById(+req.params.id);
        if (!existingAlbum) {
            res.status(404).send({
                message: `Album with id ${req.params.id} does not exist`
            });
            return;
        }

        res.status(200).send({
            message: 'Album successfully deleted'
        });
    });
};

module.exports = albumController;