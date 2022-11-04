const fs = require('fs');
const express = require('express');
const path = require('path');

const { createDirectory } = require('./app/file.js');
const { createImage } = require('./app/image.js');

require('dotenv').config();

const port = process.env.PORT;

const albums = require('./data/albums.json');
const comments = require('./data/comments.json');
const photos = require('./data/photos.json');
const posts = require('./data/posts.json');
const todos = require('./data/todos.json');
const users = require('./data/users.json');

const database = {
    albums,
    comments,
    photos,
    posts,
    todos,
    users
};

const app = express();

const resourcesDir = createDirectory(__dirname, 'resources');
const imagesDir = createDirectory(resourcesDir, 'images');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/albums', (req, res) => res.send(albums));
app.get('/api/comments', (req, res) => res.send(comments));
app.get('/api/photos', (req, res) => res.send(photos));
app.get('/api/posts', (req, res) => res.send(posts));
app.get('/api/todos', (req, res) => res.send(todos));
app.get('/api/users', (req, res) => res.send(users));

for (const key of Object.keys(database)) {
    app.get(`/api/${key}/:id`, (req, res) => {
        res.send(database[key].find(({ id }) => id === parseInt(req.params['id'], 10)));
    });
}

app.get('/api/posts/:id/comments', (req, res) =>
    res.send(comments.filter(({ postId }) => postId === parseInt(req.params['id'], 10))));

app.get('/api/image', (req, res) => {
    createImage({
        filename: path.join(imagesDir, 'kevin.png')
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 