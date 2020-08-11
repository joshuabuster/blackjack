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

let playerBalance = 500;
let playerHandTotal;
let dealerHandTotal;
let playerHand;
let dealerHand;
let playerBet;
let shuffledDeck;
let wasDoubled;
let dealerPlayed;


/*----- cached element references -----*/

const dealBtn = document.querySelector('#deal');
const hitBtn = document.querySelector('#hit');
const stayBtn = document.querySelector('#stay');
const doubleBtn = document.querySelector('#double');
const playAgainBtn = document.querySelector('#play-again');
const betInput = document.querySelector('input');
// const dealerHandEl = document.querySelector();
// const PlayerHandEl = document.querySelctor();



/*----- event listeners -----*/

betInput.addEventListener('input', function (e) {
    playerBet = parseInt(e.target.value);
})
dealBtn.addEventListener('click', function (e) {
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
});


/*----- functions -----*/

function init () {
    playerHand = [];
    dealerHand = [];
    playerBet = 0;
    dealerPlayed = false;
    wasDoubled = false;
    // will rebuilt and reshuffle every hand so i can only use one deck to prevent against card counting 
    buildMasterDeck();
    shuffleDeck();
    // render ();
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
    // udate playerBalance first and return if bet is too high
    if(playerBalance >= playerBet){
        playerBalance -= playerBet;
    } else return;
    dealPlayerCard();
    dealDealerCard();
    dealPlayerCard();
    dealDealerCard();
    getHandTotals();
    // if (playerHandTotal === 21){
    //     // render message for blackjack;
    // } else {
    //     //render message for current totals for both dealer and player;
    // }
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
}

function stay() {
    dealerPlay();
    getHandTotals();
}

function double() {
    if(wasDoubled === true) {
        return;
    } else if(playerHand.length === 2 && playerBalance >= playerBet * 2) {
        playerBalance -= playerBet;
        playerBet = playerBet * 2;
        dealPlayerCard();
        getHandTotals();
        // dealerPlay();
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
    console.log('ph: ', playerHand);
    console.log('players balance: ', playerBalance);
    console.log('players bet: ', playerBet)

    dealerHandTotal = dealerHand[0].value + dealerHand[1].value;
    for (let i = 2; i < dealerHand.length; i++) {
        dealerHandTotal += dealerHand[i].value;
    }
    console.log('dealers current total: ', dealerHandTotal);
    console.log('hd: ', dealerHand)
    compare();
}   

function compare () {
    if (playerHandTotal > 21) {
        console.log('you lose');
        // render lose message
        init();
    }

    if(dealerHandTotal === playerHandTotal && dealerHandTotal >= 17) {
        console.log('push');
        // render push message
        init();
    }
    if (dealerHandTotal > playerHandTotal && dealerHandTotal >= 17 && dealerHandTotal <= 21) {
        console.log('dealer has higher total without busting, you lose');
        // render lose message
        init()
    }

    if (dealerPlayed === true && playerHandTotal > dealerHandTotal) {
        playerBalance += playerBet * 2;
        console.log('you win!'); 
        // render winning message
        init();
    }
}

function dealerPlay() {
    dealerPlayed = true;
    // render face down to face up
    while (dealerHandTotal <= 17) {
        dealDealerCard();
        // render cards drawn for dealer as they come
        getHandTotals();
        if(dealerHandTotal > 21) {
            playerBalance += playerBet * 2;
            console.log('dealer bust, you win');
            //render win message
            init()
            break;
        }
    }
    
}

// function playAgain() {

// }

// function render() {

// }

init()

