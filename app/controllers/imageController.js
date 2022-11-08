const { loadImage } = require('../utils/image.js');

const imageController = (app, imagesDir) => {
    app.get('/api/image/:size/:color', (req, res) => {
        const color = req.params['color'].toLowerCase();
        const size = parseInt(req.params['size']);
        res.sendFile(loadImage(imagesDir, color, size));
    });
};

module.exports = { imageController };