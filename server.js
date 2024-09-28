require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const tradeRoutes = require('./routes/trade.route')

const app = express();

mongoose.connect('mongodb://localhost:27017/trades', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB Successfully connected')
}).catch(() => {
    console.error('DB Failed to connect', err)
});

app.use(express.json())

app.use('/api/trades', tradeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
