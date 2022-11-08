const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const { createDirectory } = require('./app/utils/file.js');

const { albumController } = require('./app/controllers/albumController');
const { commentController } = require('./app/controllers/commentController');
const { photoController } = require('./app/controllers/photoController');
const { postController } = require('./app/controllers/postController');
const { todoController } = require('./app/controllers/todoController');
const { userController } = require('./app/controllers/userController');
const { randomController } = require('./app/controllers/randomController');
const { imageController } = require('./app/controllers/imageController.js');

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

albumController(app, database);
commentController(app, database);
photoController(app, database);
postController(app, database);
todoController(app, database);
userController(app, database);
randomController(app);
imageController(app, imagesDir)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 