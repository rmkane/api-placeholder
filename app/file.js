const fs = require('fs');
const path = require('path');

const createDirectory = (...paths) => {
    const pathname = path.join(...paths);
    if (!fs.existsSync(pathname)) fs.mkdirSync(pathname);
    return pathname;
};

module.exports = { createDirectory };