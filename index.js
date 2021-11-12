const api = require('./api');
const symbol = process.env.SYMBOL;

setInterval(async () => {
    const result = await api.depth(symbol);
    let sell = 0, buy = 0;
    console.log(result);

    if (result && result.bids && result.bids.length){
        console.log(`Highest buy: '${result.bids[0][0]}`);
        buy = parseInt(result.bids[0][0]);
    }

    if (result && result.asks && result.asks.length){
        console.log(`Lowest sell: '${result.asks[0][0]}`);
        sell = parseInt(result.asks[0][0]);
    }
    
    if (sell < 200000){
        console.log('Comprar!')
        const account = await api.accountInfo();
        if (account && account.balances){
            //console.log('Balances:');
            //console.log(account);
            const coins = account.balances.filter(b => symbol.indexOf(b.asset) !== -1)
            console.log(coins)

        }
        
    }else if (buy > 230000){
        console.log('Vender!')
    } else{
        console.log('Aguardar...')

    }
}, process.env.CRAWLER_INTERVAL)