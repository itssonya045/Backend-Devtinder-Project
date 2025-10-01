const mongoose = require("mongoose");

const ConnectDB = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/Devtinderbackend');
}

module.exports = { ConnectDB };
