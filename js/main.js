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

// could use object to hold players info?
// could use object to hold dealers info?
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



/*----- event listeners -----*/

betInput.addEventListener('input', function (e) {
    playerBet = parseInt(e.target.value);
})
dealBtn.addEventListener('click', deal);
hitBtn.addEventListener('click', hit);
stayBtn.addEventListener('click', stay);
playAgainBtn.addEventListener('click', playAgain);


/*----- functions -----*/

function init () {
    playerHand = [];
    dealerHand = [];
    playerHandTotal = 0;
    dealerHandTotal = 0;
    playerHasAce = false;
    dealerHandTotal = false;
    playerBet = 0;
    dealerPlayed = false;
    wasDoubled = false;
    dealt = false;
    stand = false;
    betInput.value = '';
    // will rebuilt and reshuffle every hand so I can only use one deck to prevent against card counting 
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
        // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
        shuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
      }
    return shuffledDeck;
}

function deal() {
    if (dealt === true) return;
    // udate playerBalance first and return if bet is too high
    if(playerBalance >= playerBet){
        playerBalance -= playerBet;
    } else return;
    if(playerBet === 0) return;
    dealt = true;
    dealPlayerCard();
    dealDealerCard();
    dealPlayerCard();
    dealDealerCard();
    // one card for the dealer should be face down
    playerHandTotal = playerHand[0].value + playerHand[1].value;
    dealerHandTotal = dealerHand[0].value + dealerHand[1].value;
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
    if(wasDoubled === true) {
        return;
    } else if(playerHandTotal <= 21) {
        dealPlayerCard();
    }
    getHandTotals();
    render();
    // compareForAce();
}

function stay() {
    stand = true;
    dealerPlay();
}

// ====================== TO DO: DOUBLE DOWN FEATURE IF THERE IS TIME =============================
// function double() {
//     if(wasDoubled === true) {
//         return;
//     } else if(playerHand.length === 2 && playerBalance >= playerBet * 2) {
//         playerBalance -= playerBet;
//         playerBet = playerBet * 2;
//         dealPlayerCard();
//         getHandTotals();
//         dealerPlay();
//     } else {
//         wasDoubled = true;
//         return;
//     }
// }

function getHandTotals () {
    
    playerHandTotal = 0;
    dealerHandTotal = 0;
    for (let i = 0; i < playerHand.length; i++) {
        playerHandTotal += playerHand[i].value;
    }
    console.log('players current total: ', playerHandTotal);
    console.log('player hand: ', playerHand);

    for (let i = 0; i < dealerHand.length; i++) {
        dealerHandTotal += dealerHand[i].value;
    }
    console.log('dealers current total: ', dealerHandTotal);
    console.log('dealers hand: ', dealerHand)
    compareForAce();
}   

function compareForAce() {
    // =============== TO DO: NOT WORKING YET =============
    // need to check for A in player/dealer hands -- try includes? --
    // if ace is present and total is higher than 21 the Ace value needs to reset to 1
    for (let i = 0; i < dealerHand.length; i++) {
        if (dealerHand[i].value === 11) {
            dealerHasAce = true;
        } else {
            dealerHasAce = false
        }
    }
    for (let i = 0; i < playerHand.length; i++) {
        if (playerHand[i].value === 11) {
            playerHasAce = true;
        } else {
            playerHasAce = false
        };
    }   
    if (playerHandTotal > 21 && playerHasAce === true) {
        playerHandTotal = playerHandTotal - 10;
    }
    if (dealerHandTotal > 21 && dealerHasAce === true) {
        dealerHandTotal = dealerHandTotal - 10;
    }
}

function dealerPlay() {
    // the card that is face down should flip face up
    dealerPlayed = true;
    while (dealerHandTotal <= 17) {
        dealDealerCard();
        // render cards drawn for dealer as they come
        getHandTotals();
        if (dealerHandTotal > 21) {
            playerBalance = playerBalance + (playerBet * 2);
        }
    }
    render();
}

function updateBalance() {
    if (playerHand.length === 2 && playerHandTotal === 21) {
        playerBalance = playerBalance + (playerBet * 1.5);
        // for player blackjack
    }
    if (stand === true && dealerPlayed === true && playerHandTotal > dealerHandTotal) {
        playerBalance = playerBalance + (playerBet * 2);
        // for player total higher than dealers
    }
    if (stand === true && dealerHandTotal > 21) {
        playerBalance = playerBalance + (playerBet * 2);
        // for dealer bust
    }
    if (stand === true && dealerHandTotal === playerHandTotal && dealerHandTotal >= 17)
        playerBalance = playerBalance + playerBet;
        console.log('bet: ', playerBet);
        console.log('balance: ', playerBalance);
        // for push
}

function render() {
    renderBalance();
    renderMessage();
    renderHands();
}

//======================= TO DO: RENDER CARDS TO HAND ================================
function renderHands() {
    for (let i = 0; i < playerHand.length; i++) {
        let playerCardDiv = document.createElement(`div`);
        playerHandEl.appendChild(playerCardDiv);
        playerCardDiv.className = `.card ${playerHand[i].face}`;
        console.log(playerCardDiv);
    }
    for (let i = 0; i < dealerHand.length; i++) {
        let dealerCardDiv = document.createElement('div');
        dealerHandEl.appendChild(dealerCardDiv);
        dealerCardDiv.className = `.card ${dealerHand[i].face}`;
        console.log(dealerCardDiv);
    }
}
    
function renderBalance() {
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
    }else if (dealt === true && dealerPlayed === false && playerHandTotal < 21) {
        console.log('game in progress');
        message.innerHTML = `Players Current Total Is ${playerHandTotal} And The Dealer Is Currently Showing ${dealerHand[0].value}`; // figure out how to calcuate for only the showing card
    } else if (playerHandTotal > 21) {
        console.log('you bust/lose');
        message.innerHTML = `Your Total Equals ${playerHandTotal}. You Bust. Sorry You Lose.`;
        init();
    } else if (stand === true && dealerHandTotal === playerHandTotal && dealerHandTotal >= 17) {
        console.log('push');
        message.innerHTML = `Both Player And Dealer Had ${playerHandTotal}. It's A Push`;
        updateBalance();
        init();
    } else if (playerHand.length === 2 && playerHandTotal === 21) {
        console.log('Blackjack!');
        message.innerHTML = 'Blackjack!';
        updateBalance();
        init();
    }  else if (stand === true && dealerHandTotal > playerHandTotal && dealerHandTotal >= 17 && dealerHandTotal <= 21) {
        console.log('dealer has higher total without busting or has blackjack, you lose');
        message.innerHTML = `Player's Total Was ${playerHandTotal} And The Dealer's Total Was ${dealerHandTotal}. Sorry, You Lose.`;
        init();
        // player balance should be alread correct
    } else if (stand === true && dealerPlayed === true && playerHandTotal > dealerHandTotal) {
        console.log('you win!'); 
        message.innerHTML = `Player's Total Was ${playerHandTotal} And The Dealer's Total Was ${dealerHandTotal}. You Win!`;
        updateBalance();
        init();
    } else if (dealerHandTotal > 21 && stand === true) {
        console.log('dealer bust, you win');
        message.innerHTML = `Player's Total Was ${playerHandTotal}. Dealer's Total Was ${dealerHandTotal}. Dealer Bust. You Win!`;
        updateBalance();  
        init();
    } 
}
        
init();
            
            