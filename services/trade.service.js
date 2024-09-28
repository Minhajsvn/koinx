const Trade = require("../models/trade.model");
const csv = require('csv-parser');
const fs = require('fs');

const saveTradesData = async (filePath) => {
    return new Promise((resolve, reject) => {

    const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    try {
                        results.push({
                            user_id: data.User_ID,
                            utc_time: new Date(data.UTC_Time),
                            operation: data.Operation,
                            market: data.Market,
                            buyOrSell: parseFloat(data['Buy/Sell Amount']),
                            price: parseFloat(data.Price),
                        });
                    } catch (err) {
                        console.error("Error processing row: ", err);
                        reject(err);
                    }
                })
                .on('end', async () => {
                    try {
                        const bulkOps = results.map((trade) => ({
                            updateOne: {
                                filter: { user_id: trade.user_id },
                                update: { $set: trade },
                                upsert: true,
                            }
                        }));
    
                        await Trade.bulkWrite(bulkOps);
                        resolve(results);
                    } catch (err) {
                        console.error('Error saving trades:', err);
                        reject(err);
                    }
                })
                .on('error', (err) => {
                    console.error('Error reading the file:', err);
                    reject(err);
                });
    });
}

const getBalanceAtTimestamp = async (date) => {
    const trades = await Trade.find({ utc_time: { $lte: date } });

    const balances = {}

    trades.forEach(trade => {
        const [baseCoin] = trade.market.split('/');

        if (!balances[baseCoin]) {
            balances[baseCoin] = 0;
        }

        if(trade.operation === 'Buy'){
            balances[baseCoin] += trade.buyOrSell;
        }else if (trade.operation === 'Sell') {
            balances[baseCoin] -= trade.buyOrSell;
        }
    });

    return balances;
}

module.exports = {
    saveTradesData,
    getBalanceAtTimestamp
}