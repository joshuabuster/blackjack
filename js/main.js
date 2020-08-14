// Blackjack Project

/*----- psueocode -----*/

// initalize deck
// deal two random cards to player and dealer
    // both face up for player and one face one face down for dealer
// if player was dealt blackjack they win 1.5 of bet
// player received message of currect total and dealers total and is asked to hit? or stay? or double?
// if hit 
    // player receives another card face up
        // player bust? lose bet and play again?
        // if 21 or stay game will move to dealer play
            // player will recieve message if win, lose or draw
            // player balance updated
// player recieves message again to hit or stay with updated current hand totals for player
// if stay
    // moves to dealer play
        // player recieves message win, lose, draw
        // player balance updated
// recieves message play again if out of money?


/*----- constants -----*/

const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const masterDeck = buildMasterDeck();



/*----- app's state (variables) -----*/

// could use objects to hold player/dealer info?
let playerBalance = 500;
let playerHandTotal;
let dealerHandTotal;
let playerHand;
let dealerHand;
let dealerHasAce;
let playerHasAce;
let playerBet;
let shuffledDeck;
let dealerPlayed;
let stand;
let winner;
let dealt;
let playerBust;


/*----- cached element references -----*/

const dealBtn = document.querySelector('#deal');
const hitBtn = document.querySelector('#hit');
const stayBtn = document.querySelector('#stay');
const playAgainBtn = document.querySelector('#play-again');
const betInput = document.querySelector('input');
const message = document.querySelector('.messages');
const balance = document.querySelector('.balance');
const dealerHandEl = document.querySelector('.dealer-hand');
const playerHandEl = document.querySelector('.player-hand');
const resetBtn = document.querySelector('#reset');



/*----- event listeners -----*/

betInput.addEventListener('input', function (e) {
    playerBet = parseInt(e.target.value);
});
dealBtn.addEventListener('click', deal);
resetBtn.addEventListener('click', reset);
hitBtn.addEventListener('click', hit);
stayBtn.addEventListener('click', stay);
playAgainBtn.addEventListener('click', function (e) {
    playAgain();
    playAgainBtn.style.visibility = 'hidden';
});

/*----- functions -----*/

function init () {
    playerHand = [];
    dealerHand = [];
    playerHandTotal = 0;
    dealerHandTotal = 0;
    playerBet = 0;
    playerBust = false;
    dealerPlayed = false;
    dealt = false;
    stand = false;
    betInput.value = '';
    message.innerHTML = '';
    buildMasterDeck();
    shuffleDeck();
    render ();
}

function buildMasterDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          // The 'face' property maps to the library's CSS classes for cards
          face: `${suit}${rank}`,
          // Setting the 'value' property for A in game of blackjack 
          // will change A to 1 later if needed for player hand
          value: Number(rank) || (rank === 'A' ? 11 : 10)
        });
      });
    });
    return deck;
}

function shuffleDeck() {
    const tempDeck = [...masterDeck];
    shuffledDeck = [];
    while (tempDeck.length) {
        // Get a random index for a card still in the tempDeck
        const rndIdx = Math.floor(Math.random() * tempDeck.length);
        // Note the [0] after splice - this is because splice always returns an array
        // and we just want the card object in that array
        shuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
      }
    return shuffledDeck;
}

function deal() {
    if (dealt === true) return;
    if(playerBalance >= playerBet){
        playerBalance -= playerBet;
    } else return;
    if(playerBet === 0) return;
    dealt = true;
    dealPlayerCard();
    dealDealerCard();
    dealPlayerCard();
    dealDealerCard();
    playerHandTotal = getScore(playerHand); //playerHand[0].value + playerHand[1].value;
    dealerHandTotal = getScore(dealerHand); //dealerHand[0].value + dealerHand[1].value;
    message.innerHTML = '';
    render();
}

function dealPlayerCard() {
    playerHand.push(shuffledDeck.pop());
}

function dealDealerCard() {
    dealerHand.push(shuffledDeck.pop());
}

function hit() {
    if (playerHandTotal > 21) {
        playerBust = true;
    }
    if(playerHandTotal <= 21) {
        dealPlayerCard();
    }
    playerHandTotal = getScore(playerHand);
    dealerHandTotal = getScore(dealerHand);
    render();
}

function stay() {
    stand = true;
    dealerPlay();
}

function getScore(hand) {
    let aces = 0;
    let score = 0;
    for (let i = 0; i < hand.length; i++) {
        score += hand[i].value;
        if (hand[i].value === 11) {
            aces++;
        }
    }
    while (score > 21 && aces){
        score -= 10;
        aces -= 1;
    }
    return score;
}



function dealerPlay() {
    dealerPlayed = true;
    while (dealerHandTotal <= 17) {
        dealDealerCard();
        dealerHandTotal = getScore(dealerHand);
    }
    dealerHandTotal = getScore(dealerHand);
    playerHandTotal = getScore(playerHand);
    render();
}

function updateBalance() {
    let bj = playerBet * 1.5;
    let bjWin = bj + playerBet;
    let win = playerBet * 2;

    if (playerHand.length === 2 && playerHandTotal === 21) {
        playerBalance += bjWin;
        // for win, player got blackjack
    }
    if (stand === true && dealerPlayed === true && playerHandTotal > dealerHandTotal) {
        playerBalance += win;
        // for win, the player total higher than dealers
    }
    if (stand === true && dealerHandTotal > 21) {
        playerBalance += win;
        // for win, dealer bust
    }
    if (stand === true && dealerHandTotal === playerHandTotal && dealerHandTotal >= 17)
        playerBalance += playerBet;
        // for push
}

function render() {
    renderHands();
    renderBalance();
    renderMessage();
}

function renderHands() {
    playerHandEl.innerHTML = "";
    dealerHandEl.innerHTML = "";
    for (let i = 0; i < playerHand.length; i++) {
        let playerCardDiv = document.createElement(`div`);
        playerHandEl.appendChild(playerCardDiv);
        playerCardDiv.className = `card ${playerHand[i].face}`;
    }

    for (let i = 0; i < dealerHand.length; i++) {
        let dealerCardDiv = document.createElement('div');
        dealerHandEl.appendChild(dealerCardDiv);
        if(!stand && i === 1) {
            dealerCardDiv.className = 'card back-blue';
        } else {  
            dealerCardDiv.className = `card ${dealerHand[i].face}`;
        }
    }
}

function reset() {
    init();
}
    
function renderBalance() {
    updateBalance();
    balance.innerHTML = '';
    balance.innerHTML = `Your Money Amount: $${playerBalance}`;
}
        
function playAgain() {
    playerBalance = 500;
    init();       
}
        
function renderPlayAgainBtn() {
    message.innerHTML = "Sorry, You're Out Of Money";
    playAgainBtn.style.visibility = 'visible';
}
        
function renderMessage () {
    if (playerBalance === 0 && dealerPlayed === true) {
        renderPlayAgainBtn();
    } else if (playerBalance === 0 && playerBust === true) {
        renderPlayAgainBtn();
    } else if (dealt === true && dealerPlayed === false && playerHandTotal < 21) {
        message.innerHTML = `Players Current Total Is ${playerHandTotal} And The Dealer Is Currently Showing ${dealerHand[0].value}`;
    } else if (playerHandTotal > 21) {
        message.innerHTML = `Your Total Equals ${playerHandTotal}. You Bust. Sorry You Lose.`;
    } else if (stand === true && dealerHandTotal === playerHandTotal && dealerHandTotal >= 17) {
        message.innerHTML = `Both Player And Dealer Had ${playerHandTotal}. It's A Push`;
    } else if (playerHand.length === 2 && playerHandTotal === 21) {
        message.innerHTML = 'Blackjack!';
    }  else if (stand === true && dealerHandTotal > playerHandTotal && dealerHandTotal >= 17 && dealerHandTotal <= 21) {
        message.innerHTML = `Player's Total Was ${playerHandTotal} And The Dealer's Total Was ${dealerHandTotal}. Sorry, You Lose.`;
    } else if (stand === true && dealerPlayed === true && playerHandTotal > dealerHandTotal) {
        message.innerHTML = `Player's Total Was ${playerHandTotal} And The Dealer's Total Was ${dealerHandTotal}. You Win!`;
    } else if (dealerHandTotal > 21 && stand === true) {
        message.innerHTML = `Player's Total Was ${playerHandTotal}. Dealer's Total Was ${dealerHandTotal}. Dealer Bust. You Win!`; 
    } 
}
        
init();
            
            