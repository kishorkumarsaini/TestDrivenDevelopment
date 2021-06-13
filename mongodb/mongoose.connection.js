const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/todolist', {
            useNewUrlParser: true,
            useFindAndModify: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
    } catch (err) {
        console.error('Error connection to mongodb');
        console.error(err);
    }
}
module.exports = { connect };