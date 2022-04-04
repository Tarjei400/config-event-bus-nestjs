const axios = require('axios');
const Base64 = require('js-base64').Base64;
const crypto = require('crypto');

const API_URL = 'https://api.cryptochill.com';
const API_KEY = '29406ba37a514decab756c91b2391f5a';
const API_SECRET = 'RiY7xr4lyL7WinnbXTWNuGNlmRZ5afM2xZcez8BdpiL6';

function encode_hmac(key, msg) {
    return crypto.createHmac('sha256', key).update(msg).digest('hex');
}

function cryptochill_api_request(endpoint, payload = {}, method = 'GET') {
    const request_path = '/v1/' + endpoint + '/'
    payload.request = request_path;
    payload.nonce = (new Date).getTime();

    // Encode payload to base64 format and create signature using your API_SECRET
    const encoded_payload = JSON.stringify(payload);
    const b64 = Base64.encode(encoded_payload);
    const signature = encode_hmac(API_SECRET, b64);

    // Add your API key, encoded payload and signature to following headers
    let request_headers = {
        'X-CC-KEY': API_KEY,
        'X-CC-PAYLOAD': b64,
        'X-CC-SIGNATURE': signature,
    };

    return axios({
        method: method,
        url: API_URL + request_path,
        headers: request_headers,
    });
}

var payloads = [

  {
    "amount": "1",
    "currency": "USD",
    "kind": "BTC",
    "profile_id": "c4dfd1ac-ca03-4d28-b372-faca5b9808c3",
    "passthrough": JSON.stringify({"routingKey": "DEV-1"})
},
  {
    "amount": "1",
    "currency": "USD",
    "kind": "BTC",
    "profile_id": "c4dfd1ac-ca03-4d28-b372-faca5b9808c3",
    "passthrough": JSON.stringify({"routingKey": "DEV-2"})
},
  {
    "amount": "1",
    "currency": "USD",
    "kind": "BTC",
    "profile_id": "c4dfd1ac-ca03-4d28-b372-faca5b9808c3",
    "passthrough": JSON.stringify({"routingKey": "DEV-3"})
},
  {
    "amount": "1",
    "currency": "USD",
    "kind": "BTC",
    "profile_id": "c4dfd1ac-ca03-4d28-b372-faca5b9808c3",
    "passthrough": JSON.stringify({"routingKey": "PLUTONIUM-4"})
},

]

for(p of payloads) {
  console.log(p);
    cryptochill_api_request('invoices', p, 'POST').then(function (response) {
        console.log("Created");
    }).catch(function (error) {
        console.log("error");
    });

}
