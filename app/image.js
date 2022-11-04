const fs = require('fs');
const { createCanvas } = require('canvas');

const toHex = v => v.toString(16).padStart(2, '0');
const colorToHex = (r, g, b) => `#${toHex(r)}${toHex(g)}${toHex(b)}`
const invertColor = (r, g, b) => colorToHex((255 - r),(255 - g),(255 - b));

const defaultOptions = {
    width: 640,
    height: 480,
    red: 255,
    green: 255,
    blue: 255,
    text: 'Lorem ipsum',
    font: 'sans-serif',
    output: './image.png'
};

// See: https://dev.to/thormeier/how-to-generate-placeholder-images-with-a-simple-node-script-3ocf
const createImage = (options = {}) => {
    const {
        width,
        height,
        red,
        green,
        blue,
        text,
        font,
        filename,
    } = { ...defaultOptions, ...options };

    const color = colorToHex(red, green, blue);
    const textColor = invertColor(red, green, blue);
    
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
    context.fillStyle = textColor;
    context.font = `${height / 10}px ${font}`;
    
    const textSize = context.measureText(text);
    context.fillText(text , (canvas.width / 2) - (textSize.width / 2), (canvas.height / 2));
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
};

module.exports = { createImage };