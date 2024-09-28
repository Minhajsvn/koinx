const mongoose = require('mongoose');


const tradeSchema = new mongoose.Schema({
    user_id: Number,
    utc_time: Date,
    operation: String,
    market: String,
    buyOrSell: String,
    price: String,
});


const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;