const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const { randomRecords } = require('./app/fake');
const { createDirectory } = require('./app/file.js');
const { loadImage } = require('./app/image.js');

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
const module_dependencies = [
    '@fontsource/roboto',
    '@fontsource/roboto-mono',
    'normalize.css',
    'prismjs'
];
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
app.post('/api/posts', (req, res) => {
    const {
        title = '',
        body = '',
        userId = database.users[0].id
    } = req.body ?? {};
    const newPost = {
        id: database.posts.length + 1,
        title,
        body,
        userId,
    };
    res.send(newPost);
});
app.put(`/api/posts/:id`, (req, res) => {
    const {
        id,
        title,
        body,
        userId,
    } = req.body ?? {};
    if (id == null || id !== parseInt(req.params['id'], 10)) {
        res.status(400).send({
            message: `The provided id '${id}' does not match '${req.params['id']}'`
        });
        return;
    }
    const replacedPost = {
        id,
        title,
        body,
        userId,
    };
    res.send(replacedPost);
});
app.patch(`/api/posts/:id`, (req, res) => {
    const existingPost = database.posts.find(({ id }) => id === parseInt(req.params['id'], 10));
    const {
        id = existingPost.id,
        title = existingPost.title,
        body = existingPost.body,
        userId = existingPost.userId,
    } = req.body ?? {};
    if (id == null || id !== parseInt(req.params['id'], 10)) {
        res.status(400).send({
            message: `The provided id '${id}' does not match '${req.params['id']}'`
        });
        return;
    }
    const updatedPost = {
        id,
        title,
        body,
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
    const { count = 10, fields = [] } = req.body ?? {};

    if (fields.length === 0) {
        res.status(400).send({
            message: 'Did not specifiy fields'
        });
        return;
    }

    res.send(randomRecords(count, fields));
});

// Image
app.get('/api/image/:size/:color', (req, res) => {
    const color = req.params['color'].toLowerCase();
    const size = parseInt(req.params['size']);
    res.sendFile(loadImage(imagesDir, color, size));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 