container = document.querySelector('.price');
result = document.querySelector('.result');
buttons = document.querySelector('.buttons');

const endpoint = "https://api.binance.com/api/v3/ticker/price";
let startPrice;
let finalPrice;
let ticker;
let index;

// Calls the function to select a coin and start the game.
const startGame = () => {
    selectCoin();
}

// Makes the first request to get a random crypto from the JSON.
const selectCoin = async() => {
    const REQUEST = await fetch('js/tickers.json');
    const DATA = await REQUEST.json();
    let newIndex;
    do {
        newIndex = Math.round(Math.random()*4);
    }
    while(newIndex == index);
    index = newIndex;
    ticker = DATA[index].symbol;
    await firstRequest(ticker);
}

// Transforms the symbol (data directly from the API) into a more understanble string.
const getCurrencyName = ticker => {
    switch (ticker){
        case 'BTCUSDT':
            return 'Bitcoin';
        break;
        case 'SOLUSDT':
            return 'Solana';
        break;
        case 'ETHUSDT':
            return 'Ethereum';
        break;
        case 'LTCUSDT':
            return 'Litecoin';
        break;
        case 'BNBUSDT':
            return 'Binance Coin';
        break;
    }
}

// Concats the data of the symbol in the URL to make the GET request.
function encodeQueryData(data){
    let result = [];
    for (let d in data) {
        result.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
    return result;
}

// Makes the first request to get the first price of the coin selected.
const firstRequest = async(ticker) => {
    try {
            let dataRequest = {
                'symbol' : ticker,
        }
        dataRequest = encodeQueryData(dataRequest);
        let response = await fetch(endpoint+'?'+dataRequest); // Making the get request after having the URL.
        let result = await response.json();
        startPrice = result.price; // Saving the starting price in a global variable to compare & show.
        let currency = getCurrencyName(result.symbol);
        let price = parseFloat(result.price); // Converting to show more easily (else it shows data like 40,5800000)
        container.innerHTML = `<p>Crypto currency: <span>${currency}</span> and the actual price is: <span>${price}</span></p>`;
        appearButtons(); // Creates the high/low price buttons.
    } catch (error) {
        console.log(error);
    }
}

// Makes the second request to get the final price of the coin selected.
const secondRequest = async(ticker,btn) => {
    try {
            let dataRequest = {
                'symbol' : ticker,
        }
        dataRequest = encodeQueryData(dataRequest);
        let response = await fetch(endpoint+'?'+dataRequest);
        let result = await response.json();
        finalPrice = result.price; // Saving the final price to show & compare.
        setResult(btn); // Calling the function to compare both requests.
    } catch (error) {
        console.log(error);
    }
}

// Compares the first and second prices from the requests and the input of the user.
const setResult = (btn) => {
    if (finalPrice > startPrice && btn == 'high') {
        showResult(true,btn);
    } else if (finalPrice < startPrice && btn == 'low'){
        showResult(true,btn);
    } else {
        showResult(false,btn);
    }
}

// Displays the result of the comparision.
const showResult = (status,btn) => {
    buttons.textContent = '';
    let price = parseFloat(finalPrice);
    let priceStart = parseFloat(startPrice);
    if (status == true) {
        container.innerHTML = `<span class='win'>YOU WIN!</span> <p>The starting price was <span>${priceStart}</span></p> 
        <p>The final price was <span>${price}</span></p> <p>& you chose: <span>${btn}</span> price</p>`;
    } else if (status == false) {
        container.innerHTML = `<span class='lose'>YOU LOSE!</span> <p>The starting price was <span>${priceStart}</span></p>
        <p>The final price was <span>${price}</span></p> <p>& you chose: <span>${btn}</span> price</p>`;
    }
    nextGame(status);
}

// Creates the button for next game option.
const nextGame = (status) => {
    nextBtn = document.createElement('BUTTON');
    nextBtn.classList.add('next');
    nextBtn.onclick = ( () => {startGame()});
    if (status === false){
        nextBtn.textContent = 'Give me another chance'
    } else {
        nextBtn.textContent = 'Try me again'
    }
    buttons.appendChild(nextBtn);
}

// Removes the buttons (high/low price) > Maybe it should be an display = 'none' but..
const dissapearButtons = () => {
    buttons.removeChild(buttons.firstElementChild);
    buttons.removeChild(buttons.lastElementChild);
}

// Creates the high/low price options buttons.
const appearButtons = () => {
    buttons.textContent = '';
    let high = document.createElement('BUTTON');
    high.classList.add('button','high');
    high.textContent = 'Higher price';
    high.onclick = async()=> {
        setTimeout(() => secondRequest(ticker,'high'),5000); // Makes the request after 5s (waiting the price volatility)
        dissapearButtons()
        countDown(); // Shows the countdown (5 to 1)
    };
    let low = document.createElement('BUTTON');
    low.classList.add('button','low');
    low.textContent = 'Lower price';
    low.onclick = async()=> {
        setTimeout(() => secondRequest(ticker,'low'),5000); // Makes the request after 5s (waiting the price volatility)
        dissapearButtons();
        countDown(); // Shows the countdown (5 to 1)
    }
    buttons.appendChild(high);
    buttons.appendChild(low);
}

// Displays a countdown (5 to 1)
const countDown = () =>{
    let second = 5;
    const interval = setInterval(()=> {
            buttons.textContent = second;
            second--;
        }, 1000);
    setTimeout(()=>{
        clearInterval(interval);
    },5000);
}

// The first-game screen to start the game with the button. It needs to include a FAQ button for explain what happen with the crypto volatility.
const initialScreen = () => {
    container.textContent = '';
    const optionStart = document.createElement('BUTTON');
    optionStart.classList.add('start');
    optionStart.textContent = 'Start game';
    optionStart.onclick = (() =>{
        startGame();
    })
    container.appendChild(optionStart);

    const optionFAQ = document.createElement('BUTTON');
    optionFAQ.classList.add('faq');
    optionFAQ.textContent = 'FAQ';
    optionFAQ.onclick = (()=> {
        showInformation();
    })
    container.appendChild(optionFAQ);
}

const showInformation = () => {
    container.innerHTML = `
    <h3>Why the price changes every 5 seconds?</h3>
    <p>> Because the crypto-currency is a very volatile asset and the market is open 24/7.</p>
    <h3>How does this game work?</h3>
    <p>> Basically you</p>
    <button class = 'return' onclick = "initialScreen()">Return</button>`
}

initialScreen();