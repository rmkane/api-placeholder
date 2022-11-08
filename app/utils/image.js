const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const HEX_PATTERN = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

const toHex = v => v.toString(16).padStart(2, '0');
const colorToHex = (r, g, b) => `#${toHex(r)}${toHex(g)}${toHex(b)}`
const invertColor = (r, g, b) => colorToHex((255 - r),(255 - g),(255 - b));

const hexToRgb = (hex) => {
    const result = HEX_PATTERN.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

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
    
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text , canvas.width / 2, canvas.height / 2);

    fs.writeFileSync(filename, canvas.toBuffer('image/png'));
};

const loadImage = (imagesDir, color, size) => {
  const { r: red, g: green, b: blue } = hexToRgb(color);
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

  return filename;
};

module.exports = { createImage, loadImage };