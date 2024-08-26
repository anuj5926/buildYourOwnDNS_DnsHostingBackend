const { default: mongoose } = require("mongoose");

function MongoConnect() {
    mongoose.connect('mongodb+srv://anuj:Anuj5926@dns.csww1j3.mongodb.net/?retryWrites=true&w=majority&appName=DNS');

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
}
module.exports = { MongoConnect };