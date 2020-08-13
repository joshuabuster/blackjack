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
// if double down
    // does player have enough money to double
    // yes removed original bet amount again and add to bet amount
    // player is dealt one and only more card from deck.
    // game will then move into stay (dealer plays/ compares players and dealers hand/ msg win, lose, draw)
// recieves message play again?


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
let playerBet;
let shuffledDeck;
let wasDoubled;
let dealerPlayed;
let stand;
let winner;
let dealt;


/*----- cached element references -----*/

const dealBtn = document.querySelector('#deal');
const hitBtn = document.querySelector('#hit');
const stayBtn = document.querySelector('#stay');
const doubleBtn = document.querySelector('#double');
const playAgainBtn = document.querySelector('#play-again');
const betInput = document.querySelector('input');
const message = document.querySelector('.messages');
const balance = document.querySelector('.balance');
const dealerHandEl = document.querySelector('.dealer-hand');
const playerHandEl = document.querySelector('.player-hand');



/*----- event listeners -----*/

betInput.addEventListener('input', function (e) {
    playerBet = parseInt(e.target.value);
    // once bet input received and deal button clicked clear bet amout from window
})
dealBtn.addEventListener('click', function (e) {
    // once bet input received and deal button clicked clear bet amout from window
    console.log('deal');
    deal();
});
hitBtn.addEventListener('click', function (e) {
    console.log('hit');
    hit();
});
stayBtn.addEventListener('click', function (e) {
    console.log('stay');
    stay();
});
doubleBtn.addEventListener('click', function (e) {
    console.log('double');
    double();
});
playAgainBtn.addEventListener('click', function (e) {
    console.log('play again');
    playAgain();
});


/*----- functions -----*/

function init () {
    playerHand = [];
    dealerHand = [];
    playerBet = 0;
    dealerPlayed = false;
    wasDoubled = false;
    winner = false;
    dealt = false;
    stand = false;
    // will rebuilt and reshuffle every hand so i can only use one deck to prevent against card counting 
    buildMasterDeck();
    shuffleDeck();
    // message.innerHTML = '';
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
    dealt = true;
    // udate playerBalance first and return if bet is too high
    if(playerBalance >= playerBet){
        playerBalance -= playerBet;
    } else return;
    if(playerBet === 0) return;
    dealPlayerCard();
    dealDealerCard();
    dealPlayerCard();
    // one card for the dealer should be face down
    dealDealerCard();
    getHandTotals();
    // compareForAce();
    betInput.value = '';
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

function double() {
    if(wasDoubled === true) {
        return;
    } else if(playerHand.length === 2 && playerBalance >= playerBet * 2) {
        playerBalance -= playerBet;
        playerBet = playerBet * 2;
        dealPlayerCard();
        getHandTotals();
        dealerPlay();
    } else {
        wasDoubled = true;
        return;
    }
}

function getHandTotals () {
    playerHandTotal = playerHand[0].value + playerHand[1].value;
    for (let i = 2; i < playerHand.length; i++) {
        playerHandTotal += playerHand[i].value;
    }
    console.log('players current total: ', playerHandTotal);
    console.log('player hand: ', playerHand);

    dealerHandTotal = dealerHand[0].value + dealerHand[1].value;
    for (let i = 2; i < dealerHand.length; i++) {
        dealerHandTotal += dealerHand[i].value;
    }
    console.log('dealers current total: ', dealerHandTotal);
    console.log('dealers hand: ', dealerHand)
}   

// function compareForAce() {
//     // need to check for A in player/dealer hands  includes?
//     // if ace is present and total is higher than 21 the Ace value needs to reset to 1

// }

function dealerPlay() {
    // the card that is face down should flip face up
    dealerPlayed = true;
    while (dealerHandTotal <= 17) {
        dealDealerCard();
        // render cards drawn for dealer as they come
        getHandTotals();
        // compareForAce()
        if(dealerHandTotal > 21) {
            playerBalance += playerBet * 2;
        }
    }
    render();
}

function render() {
    // renderHands();
    renderBalance();
    renderMessage();
}

// function renderHands() {
    //     playerHandEl.appendChild();
    //     dealerHandEl.appendChild();
    // }
    
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
    if (winner === false && dealt === true && dealerPlayed === false) {
        console.log('game in progress');
        message.innerHTML = `Players Current Total Is ${playerHandTotal} And The Dealer Is Currently Showing ${dealerHand[0].value}`; // figure out how to calcuate for only the showing card
    } 
    if (playerHandTotal > 21) {
        winner = true; // maybe should go in compare()
        console.log('you bust/lose');
        message.innerHTML = `Your Total Equals ${playerHandTotal}. You Bust. Sorry You Lose.`;
        init();
    }
    if (playerHand.length === 2 && playerHandTotal === 21) {
        winner = true; // maybe should go in compare()
        playerBalance += playerBet + playerBet * 1.5; // maybe should go in compare()
        console.log('Blackjack!');
        message.innerHTML = 'Blackjack!';
        init();
    }
    if (stand === true && dealerHandTotal === playerHandTotal && dealerHandTotal >= 17) {
        winner = true; // maybe should go in compare()
        console.log('push');
        message.innerHTML = `Both Player And Dealer Had ${playerHandTotal}. It's A Push`;
        init();       
    }
    if (stand === true && dealerHandTotal > playerHandTotal && dealerHandTotal >= 17 && dealerHandTotal <= 21) {
        winner = true; // maybe should go in compare()
        console.log('dealer has higher total without busting or has blackjack, you lose');
        message.innerHTML = `Player's Total Was ${playerHandTotal} And The Dealer's Total Was ${dealerHandTotal}. Sorry, You Lose.`; 
        init()
    }
    if (stand === true && dealerPlayed === true && playerHandTotal > dealerHandTotal) {
        winner = true; // maybe should go in compare()
        playerBalance += playerBet * 2; // maybe should go in compare()
        console.log('you win!'); 
        message.innerHTML = `Player's Total Was ${playerHandTotal} And The Dealer's Total Was ${dealerHandTotal}. You Win!`;
        init();     
    }
    if (stand === true && dealerHandTotal > 21) {
        winner = true; // maybe should go in compare()
        playerBalance += playerBet * 2; // maybe should go in compare()
        console.log('dealer bust, you win');
        message.innerHTML = 'Dealer Bust! You Win!';
        init();
    }
    // need to figure how to account for true game over
    if (playerBalance === 0) {
        renderPlayAgainBtn();
    }
}
        
init();
            
            