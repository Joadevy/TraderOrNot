container = document.querySelector('.price');
result = document.querySelector('.result');
buttons = document.querySelector('.buttons');

const endpoint = "https://api.binance.com/api/v3/ticker/price";
let startPrice;
let finalPrice;
let ticker;
let index;

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
        let currency = getCurrencyName(result.symbol);
        let price = parseFloat(result.price);
        // let roundPrice = Math.round(result.price) >>>>>  Find a form to round into 2/3 decimals.
        container.innerHTML = `Crypto currency: <span>${currency}</span> and the actual price is: <span>${price}</span>`;
        appearButtons();
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
        //console.log('el precio final es: ' + finalPrice);
        setResult(btn);
    } catch (error) {
        console.log(error);
    }
}

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
    await showRequest(ticker);
}

const setResult = (btn) => {
    if (finalPrice > startPrice && btn == 'high') {
        showResult(true);
    } else if (finalPrice < startPrice && btn == 'low'){
        showResult(true);
    } else {
        showResult(false);
    }
}

const dissapearButtons = () => {
    buttons.removeChild(buttons.firstElementChild);
    buttons.removeChild(buttons.lastElementChild);
}

const appearButtons = () => {
    buttons.textContent = '';
    let high = document.createElement('BUTTON');
    high.classList.add('button','high');
    high.textContent = 'Higher price';
    high.onclick = async()=> {
        setTimeout(() => compareRequest(ticker,'high'),5000);
        dissapearButtons()
        countDown();
    };
    let low = document.createElement('BUTTON');
    low.classList.add('button','low');
    low.textContent = 'Lower price';
    low.onclick = async()=> {
        setTimeout(() => compareRequest(ticker,'low'),5000);
        dissapearButtons();
        countDown();
    }
    buttons.appendChild(high);
    buttons.appendChild(low);
}

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

const startGame = () => {
    selectCoin();
}

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

const initialScreen = () => {
    const option = document.createElement('BUTTON');
    option.classList.add('start');
    option.textContent = 'Start game';
    option.onclick = (() =>{
        startGame();
    })
    container.appendChild(option);
}

const showResult = (status) => {
    buttons.textContent = '';
    let price = parseFloat(finalPrice);
    if (status == true) {
        container.innerHTML = `<span class='win'>YOU WIN!</span> The final price was <span>${price}</span>`;
    } else if (status == false) {
        container.innerHTML = `<span class='lose'>YOU LOSE!</span> The final price was <span>${price}</span>`;
    }
    nextGame(status);
    if (result.firstElementChild === null) {
        createScore();
        updateScore();
    }
    updateScore();
}

const nextGame = (status) => {
    nextBtn = document.createElement('BUTTON');
    nextBtn.classList.add('next');
    nextBtn.onclick = ( () => {startGame()});
    if (status === false){
        nextBtn.textContent = 'Give me another chance'
    } else {
        nextBtn.textContent = 'Try me again'
    }
    container.appendChild(nextBtn);
}

initialScreen();