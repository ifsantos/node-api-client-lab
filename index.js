const api = require('./api');
const symbol = process.env.SYMBOL;
const profitability = parseFloat(process.env.PROFITABILITY);

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
            console.log('Balances:');
            console.log(account);
            const coins = account.balances.filter(b => symbol.indexOf(b.asset) !== -1);
            console.log(coins);

            console.log('Verificando se ha saldo...');
            if ( sell <= parseInt(coins.find(c=>c.asset === 'BUSD').free) ){
                console.log('Comprando...');
                const compra = await api.newOrder(symbol,1);
                console.log(`orderId: ${compra.orderId}`);
                console.log(`status: ${compra.status}`);
                
                console.log('Posicionando venda com lucro');
                const price = parseInt(sell * profitability)
                const venda = await api.newOrder(symbol, 1, price, 'SELL', 'LIMIT');
                console.log(`orderId: ${venda.orderId}`);
                console.log(`status: ${venda.status}`);
                

            }

        }
        
    }else if (buy > 230000){
        console.log('Vender!')
    } else{
        console.log('Aguardar...')

    }
}, process.env.CRAWLER_INTERVAL)