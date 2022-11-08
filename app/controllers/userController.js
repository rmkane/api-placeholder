const userController = (app, database) => {
    app.get(`/api/users`, (req, res) => {
        res.send(database.users);
    });
    app.get(`/api/users/:id`, (req, res) => {
        res.send(database.users.find(({ id }) => id === parseInt(req.params['id'], 10)));
    });
    app.get('/api/users/:id/albums', (req, res) => {
        res.send(database.albums.filter(({ userId }) => userId === parseInt(req.params['id'], 10)));
    });
    app.get('/api/users/:id/posts', (req, res) => {
        res.send(database.posts.filter(({ userId }) => userId === parseInt(req.params['id'], 10)));
    });
    app.get('/api/users/:id/todos', (req, res) => {
        res.send(database.todos.filter(({ userId }) => userId === parseInt(req.params['id'], 10)));
    });
    app.post('/api/users', (req, res) => {
        const {
            address: {
                city = '',
                geo: {
                    lat = '',
                    lng = ''
                } = {},
                street = '',
                suite = '',
                zipcode = ''
            } = {},
            company: {
                bs = '',
                catchPhrase = '',
                name: companyName = ''
            } = {},
            email = '',
            name = '',
            phone = '',
            username = '',
            website = ''
        } = req.body ?? {};
        const newUser = {
            address: {
                city,
                geo: {
                    lat,
                    lng
                },
                street,
                suite,
                zipcode
            },
            company: {
                bs,
                catchPhrase,
                name: companyName
            },
            email,
            id: database.users.length + 1,
            name,
            phone,
            username,
            website
        };
        res.send(newUser);
    });
    app.put(`/api/users/:id`, (req, res) => {
        const existingUser = database.users.find(({ id }) => id === parseInt(req.params['id'], 10));
        if (!existingUser) {
            res.status(404).send({
                message: `User with id ${req.params['id']} does not exist`
            });
            return;
        }
        const {
            address: {
                city = '',
                geo: {
                    lat = '',
                    lng = ''
                } = {},
                street = '',
                suite = '',
                zipcode = ''
            } = {},
            company: {
                bs = '',
                catchPhrase = '',
                name: companyName = ''
            } = {},
            email = '',
            id,
            name = '',
            phone = '',
            username = '',
            website = ''
        } = req.body ?? {};
        if (id == null || id !== parseInt(req.params['id'], 10)) {
            res.status(400).send({
                message: `The provided id '${id}' does not match '${req.params['id']}'`
            });
            return;
        }
        const replacedUser = {
            address: {
                city,
                geo: {
                    lat,
                    lng
                },
                street,
                suite,
                zipcode
            },
            company: {
                bs,
                catchPhrase,
                name: companyName
            },
            email,
            id,
            name,
            phone,
            username,
            website
        };
        res.send(replacedUser);
    });
    app.patch(`/api/users/:id`, (req, res) => {
        const existingUser = database.users.find(({ id }) => id === parseInt(req.params['id'], 10));
        if (!existingUser) {
            res.status(404).send({
                message: `User with id ${req.params['id']} does not exist`
            });
            return;
        }
        const {
            address: {
                city = existingUser?.address?.city ?? '',
                geo: {
                    lat = existingUser?.address?.geo?.lat ?? '',
                    lng = existingUser?.address?.geo?.lng ?? ''
                } = {},
                street = existingUser?.address?.street ?? '',
                suite = existingUser?.address?.suite ?? '',
                zipcode = existingUser?.address?.zipcode ?? '',
            } = {},
            company: {
                bs = existingUser?.company?.bs ?? '',
                catchPhrase = existingUser?.company?.catchPhrase ?? '',
                name: companyName = existingUser?.company?.name ?? '',
            } = {},
            email = existingUser?.email ?? '',
            id = existingUser.id,
            name = existingUser?.name ?? '',
            phone = existingUser?.phone ?? '',
            username = existingUser?.username ?? '',
            website = existingUser?.website ?? '',
        } = req.body ?? {};
        if (id == null || id !== parseInt(req.params['id'], 10)) {
            res.status(400).send({
                message: `The provided id '${id}' does not match '${req.params['id']}'`
            });
            return;
        }
        const updatedUser = {
            address: {
                city,
                geo: {
                    lat,
                    lng
                },
                street,
                suite,
                zipcode
            },
            company: {
                bs,
                catchPhrase,
                name: companyName
            },
            email,
            id,
            name,
            phone,
            username,
            website
        };
        res.send(updatedUser);
    });
    app.delete('/api/users/:id', (req, res) => {
        const existingUser = database.users.find(({ id }) => id === parseInt(req.params['id'], 10));
        if (!existingUser) {
            res.status(404).send({
                message: `User with id ${req.params['id']} does not exist`
            });
            return;
        }

        res.status(200).send({
            message: 'User successfully deleted'
        });
    });
};

module.exports = userController;