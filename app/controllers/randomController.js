const { randomRecords } = require('../utils/fake.js');

const randomController = (app) => {
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
};

module.exports = randomController;