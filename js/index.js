container = document.querySelector('.price');
result = document.querySelector('.result');
buttons = document.querySelector('.buttons');

let startPrice;
let finalPrice;
let ticker;
const endpoint = "https://api.binance.com/api/v3/ticker/price";
let score = 0;

/*  highbtn.addEventListener('click', async()=> {
    setTimeout(() => compareRequest(ticker,'high'),5000);
    dissapearButtons();
})

lowbtn.addEventListener('click', async()=> {
    setTimeout(() => compareRequest(ticker,'low'),5000);
    dissapearButtons();
})  */

// Function that creates concats the data in the URL to make the GET request.
function encodeQueryData(data){
    let result = [];
    for (let d in data) {
        result.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
    return result;
}

const showRequest = async(ticker) => {
    try {
            let dataRequest = {
                'symbol' : ticker,
        }
        dataRequest = encodeQueryData(dataRequest);
        let response = await fetch(endpoint+'?'+dataRequest);
        let result = await response.json();
        startPrice = result.price;
        console.log('el precio inicial es: ' + startPrice);
        // let roundPrice = Math.round(result.price) >>>>>  Find a form to round into 2/3 decimals.
        container.textContent = `Crypto currency: ${result.symbol} and the actual price is: ${result.price}`;
    } catch (error) {
        console.log(error);
    }
}

const compareRequest = async(ticker,btn) => {
    try {
            let dataRequest = {
                'symbol' : ticker,
        }
        dataRequest = encodeQueryData(dataRequest);
        let response = await fetch(endpoint+'?'+dataRequest);
        let result = await response.json();
        finalPrice = result.price;
        console.log('el precio final es: ' + finalPrice);
        if (finalPrice > startPrice) {
            setResult('final',btn)
        } else if (finalPrice < startPrice){
            setResult('start',btn)
        } else {
            setResult('equal');
        }
    } catch (error) {
        console.log(error);
    }
}

//request('ETHUSDT')
//setInterval(() => request('ETHUSDT'),5000);

const selectCoin = async() => {
    const REQUEST = await fetch('../js/tickers.json');
    const DATA = await REQUEST.json();
    let index = Math.round(Math.random()*4);
    ticker = DATA[index].symbol;
    await showRequest(ticker);
}

const setResult = (result,btn) => {
    if (result == 'final' && btn == 'high') {
        console.log('WIN');
        score++;
    } else if (result == 'start' && btn == 'low'){
        console.log('WIN');
        score++;
    } else {
        console.log('LOSER');
    }
    updateScore();
    startGame()
}

const updateScore = () => {
    result.lastElementChild.innerHTML = `SCORE: ${score}`;
}

const dissapearButtons = () => {
    buttons.removeChild(buttons.firstElementChild);
    buttons.removeChild(buttons.lastElementChild);
}

const appearButtons = () => {
    let high = document.createElement('BUTTON');
    high.classList.add('button','high');
    high.textContent = 'Higher price';
    high.onclick = async()=> {
        setTimeout(() => compareRequest(ticker,'high'),5000);
        dissapearButtons();
    };
    let low = document.createElement('BUTTON');
    low.classList.add('button','low');
    low.textContent = 'Lower price';
    low.onclick = async()=> {
        setTimeout(() => compareRequest(ticker,'low'),5000);
        dissapearButtons(); }
    buttons.appendChild(high);
    buttons.appendChild(low);
}

const startGame = () => {
    appearButtons();
    selectCoin();
}

startGame();
