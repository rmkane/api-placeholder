const photoController = (app, database) => {
    const findById = (id) =>
        database.photos.find((photo) => photo.id === id);
        
    app.get(`/api/photos`, (req, res) => {
        res.send(database.photos);
    });

    app.get(`/api/photos/:id`, (req, res) => {
        res.send(findById(+req.params.id));
    });

    app.post('/api/photos', (req, res) => {
        const {
            albumId = database.albums[0].id,
            thumbnailUrl = '',
            title = '',
            url = ''
        } = req.body ?? {};
        const newPhoto = {
            albumId,
            id: database.photos.length + 1,
            thumbnailUrl,
            title,
            url
        };
        res.send(newPhoto);
    });

    app.put(`/api/photos/:id`, (req, res) => {
        const existingPhoto = findById(+req.params.id);
        if (!existingPhoto) {
            res.status(404).send({
                message: `Photo with id ${req.params.id} does not exist`
            });
            return;
        }
        const {
            albumId = '',
            id,
            thumbnailUrl = '',
            title = '',
            url = ''
        } = req.body ?? {};
        if (id == null || id !== +req.params.id) {
            res.status(400).send({
                message: `The provided id '${id}' does not match '${req.params.id}'`
            });
            return;
        }
        const replacedPhoto = {
            albumId,
            id,
            thumbnailUrl,
            title,
            url
        };
        res.send(replacedPhoto);
    });

    app.patch(`/api/photos/:id`, (req, res) => {
        const existingPhoto = findById(+req.params.id);
        if (!existingPhoto) {
            res.status(404).send({
                message: `Photo with id ${req.params.id} does not exist`
            });
            return;
        }
        const {
            albumId = existingPhoto?.albumId ?? '',
            id = existingPhoto.id,
            thumbnailUrl = existingPhoto?.thumbnailUrl ?? '',
            title = existingPhoto?.title ?? '',
            url = existingPhoto?.url ?? '',

        } = req.body ?? {};
        if (id == null || id !== +req.params.id) {
            res.status(400).send({
                message: `The provided id '${id}' does not match '${req.params.id}'`
            });
            return;
        }
        const updatedPhoto = {
            albumId,
            id,
            thumbnailUrl,
            title,
            url
        };
        res.send(updatedPhoto);
    });

    app.delete('/api/photos/:id', (req, res) => {
        const existingPhoto = findById(+req.params.id);
        if (!existingPhoto) {
            res.status(404).send({
                message: `Photo with id ${req.params.id} does not exist`
            });
            return;
        }

        res.status(200).send({
            message: 'Photo successfully deleted'
        });
    });
};

module.exports = photoController;