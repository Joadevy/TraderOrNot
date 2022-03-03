/* const request = fetch("https://api.binance.com/api/v3/ticker/price",{
    method:'GET',
    params: JSON.stringify({
        "symbol":"LTCBTC"
    })
})
.then (response => response.json())
.then (data => console.log(data));
 */

container = document.querySelector('.price');

function encodeQueryData(data){
    let result = [];
    for (let d in data) {
        result.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
    return result;
}

const request = async(ticker) => {
    let endpoint = "https://api.binance.com/api/v3/ticker/price";
    let dataRequest = {
            'symbol' : ticker,
    }
    dataRequest = encodeQueryData(dataRequest);
    console.log(endpoint+'?'+dataRequest);
    let response = await fetch(endpoint+'?'+dataRequest);
    console.log(response);
    let result = await response.json();
    console.log(result);
    container.textContent = `Crypto coin: ${result.symbol} and the actual price is: ${result.price}`;
}

request('ETHUSDT')
//setInterval(() => request('ETHUSDT'),5000);