const axios = require('axios');
/*
The querystring API is considered Legacy. While it is still maintained, new code should use the URLSearchParams API instead.
*/
const querystring = require('querystring');
const crypto = require('crypto');
const apiKey = process.env.API_KEY;
const secretKey = process.env.SECRET_KEY;
const apiUrl = process.env.API_URL;

async function privateCall(path, data={}, method = 'GET'){
    const timestamp  = Date.time();
    const signature = crypto.createHmac('sha256', apiSecret)
                        .update(`${querystring.stringify({...data,timestamp})}`)
                        .digest('hex');
    const newData = {...data, timestamp,  signature };
    const qs =  `?${querystring.stringify(newData)}`;

    try {
        const result  = await axios({
            method,
            url: `${api_url}${path}${qs}`,
            headers: { 'X-MBX-APIKEY': apiKey}
        })
        return result.data;

    } catch ( err ) {
        console.log(err);
    } 
}

async function accountInfo(){
    return privateCall('/v3/account');
}


async function publicCall(path, data, method = 'GET'){
    try {
        const qs = data ? `?${querystring.stringify(data)}` : '';
        const result = await axios({
            method,
            url: `${process.env.API_URL}${path}${qs}`
        });

        return result.data;
    } catch (err) {
        console.log(err)
    }
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

module.exports = { time, depth, exchangeInfo, accountInfo }