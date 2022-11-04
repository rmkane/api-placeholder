const fs = require('fs');
const express = require('express');
const path = require('path');

const { createDirectory } = require('./app/file.js');
const { createImage } = require('./app/image.js');

const albums = require('./data/albums.json');
const comments = require('./data/comments.json');
const photos = require('./data/photos.json');
const posts = require('./data/posts.json');
const todos = require('./data/todos.json');
const users = require('./data/users.json');

const app = express();
const port = 3000;

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

app.get('/api/image', (req, res) => {
    createImage({
        filename: path.join(imagesDir, 'example.png')
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 