const api = require('./api');

setInterval(async () => {
    const result = await api.depth();
    console.log(`Highest buy: '${result.bids[0][0]}`);
    console.log(`Lowest sell: '${result.asks[0][0]}`);
    
    const buy = parseInt(result.bids[0][0]);
    const sell = parseInt(result.asks[0][0]);
    
    if (sell < 200000){
        const account = await api.accountInfo();
        console.log('Comprar!')
        const coins = account.balances.filter(b => Symbol.indexOf(b.asset) !== -1)
        console.log()
        
    }else if (buy > 230000){
        console.log('Vender!')
    } else{
        console.log('Aguardar...')

    }
}, process.env.CRAWLER_INTERVAL)