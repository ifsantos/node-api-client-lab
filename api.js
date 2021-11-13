const axios = require('axios');
/*
The querystring API is considered Legacy. While it is still maintained, new code should use the URLSearchParams API instead.
*/
const querystring = require('querystring');
//const urlSearchParams = require('URLSearchParams');
const crypto = require('crypto');
const apiKey = process.env.API_KEY;
const secretKey = process.env.SECRET_KEY;
const apiUrl = process.env.API_URL;

async function privateCall(path, data={}, method = 'GET'){
    const timestamp  = Date.now();
    //console.log(`[Private] data: ${data}`);
    let paramTimestamp = new URLSearchParams({...data, timestamp})
    const signature = crypto.createHmac('sha256', secretKey)
                        //.update(`${querystring.stringify({...data,timestamp})}`)
                        .update(`${paramTimestamp.toString()}`)
                        .digest('hex');
    const newData = {...data, timestamp, signature };    
    //const qs =  `?${querystring.stringify(newData)}`;
    const params = new URLSearchParams(newData);
    
    const qs =  `?${params.toString()}`;
    //console.log(`[Private] QueryS : ${qs}`);

    try {
        const result  = await axios({
            method,
            url: `${apiUrl}${path}${qs}`,
            headers: { 'X-MBX-APIKEY': apiKey } //binance header
        })
        console.log(`[Private] Status: ${result.status} - ${result.statusText}`);
        return result.data;

    } catch ( err ) {
        console.log(err);
    } 
}

async function publicCall(path, data, method = 'GET'){
    try {
        const params = new URLSearchParams(data);
        //const qs = data ? `?${querystring.stringify(data)}` : '';
        const qs = data ? `?${params.toString()}` : '';
        const result = await axios({
            method,
            url: `${apiUrl}${path}${qs}`
        });
        console.log(`public status: ${result.status} - ${result.statusText}`);
        return result.data;
    } catch (err) {
        console.log(err)
    }
}


async function accountInfo(){
    return privateCall('/v3/account');
}

async function newOrder(symbol, quantity, price, side = 'BUY', type = 'MARKET'){
    const data = { symbol, quantity, side, type }

    if (price) data.price = price;
    if (type === 'LIMIT') data.timeInForce = 'GTC';


    return privateCall('/v3/order',data, 'POST');
}

async function time(){
    return publicCall('/v3/time');
}

async function exchangeInfo(){
    return publicCall('/v3/exchangeInfo');
}

async function depth(symbol = 'BTCBRL', limit = 5){
    return publicCall('/v3/depth', {symbol, limit})
}

module.exports = { time, depth, exchangeInfo, accountInfo, newOrder }