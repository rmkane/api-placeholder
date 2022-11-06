const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { faker } = require('@faker-js/faker');

const { createDirectory } = require('./app/file.js');
const { createImage, hexToRgb } = require('./app/image.js');

require('dotenv').config();

const resourcesDir = createDirectory(__dirname, 'resources');
const imagesDir = createDirectory(resourcesDir, 'images');

const database = {
    albums: require('./data/albums.json'),
    comments: require('./data/comments.json'),
    photos: require('./data/photos.json'),
    posts: require('./data/posts.json'),
    todos: require('./data/todos.json'),
    users: require('./data/users.json'),
};

const port = process.env.PORT ?? 3000;
const app = express();

// Configure Express to allow for body parsing for POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// Allow content to be served from public as a root source
app.use(express.static(path.join(__dirname, 'public')));

// Allow certain node_modules to be loaded in the browser
// https://stackoverflow.com/questions/27464168#answer-55700773
const module_dependencies = ['@fontsource/roboto', 'normalize.css'];
module_dependencies.forEach(dep => {
    app.use(`/libs/${dep}`, express.static(path.resolve(`node_modules/${dep}`)));
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Albums
app.get(`/api/albums`, (req, res) => {
    res.send(database.albums);
});
app.get(`/api/albums/:id`, (req, res) => {
    res.send(database.albums.find(({ id }) => id === parseInt(req.params['id'], 10)));
});
app.get('/api/albums/:id/photos', (req, res) => {
    res.send(database.photos.filter(({ albumId }) => albumId === parseInt(req.params['id'], 10)));
});

// Comments
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

// Photos
app.get(`/api/photos`, (req, res) => {
    res.send(database.photos);
});
app.get(`/api/photos/:id`, (req, res) => {
    res.send(database.photos.find(({ id }) => id === parseInt(req.params['id'], 10)));
});

// Posts
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

// Todos
app.get(`/api/todos`, (req, res) => {
    res.send(database.todos);
});
app.get(`/api/todos/:id`, (req, res) => {
    res.send(database.todos.find(({ id }) => id === parseInt(req.params['id'], 10)));
});

// Users
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

// Random
app.post(`/api/random`, (req, res) => {
    const { count = 10 } = req.body ?? {};

    console.log('BODY:', req.body);
    console.log('COUNT:', count);

    res.send([{
        userId: faker.datatype.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: faker.internet.password(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past(),
    }]);
});

// Image
app.get('/api/image/:size/:color', (req, res) => {
    const color = req.params['color'].toLowerCase();
    const { r: red, g: green, b: blue } = hexToRgb(color);
    const size =  parseInt(req.params['size']);
    const filename = path.join(imagesDir, `${color}-${size}.png`);

    if (!fs.existsSync(filename)) {
        createImage({
            red,
            green,
            blue,
            width: size,
            height: size,
            text: `${size}×${size}`,
            filename
        });
    }

    res.sendFile(filename);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 