const tradeService = require('../services/trade.service')

const uploadTrades = async (req, res) => {
    try {
        const result = await tradeService.saveTradesData(req.file.path);
        res.status(200).json({ message: 'Trades uploaded successfully.', result });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading trades.', error });
    }
}

const getBalance = async (req, res) => {
    const { timestamp } = req.body;

    if(!timestamp){
        res.status(400).json({ error: 'Timestamp is required' })
    }

    try {
        const date = new Date(timestamp);
        const balance = await tradeService.getBalanceAtTimestamp(date);
        res.status(200).json(balance)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error calculating balance' })
    }
}


module.exports = {
    uploadTrades,
    getBalance,
}