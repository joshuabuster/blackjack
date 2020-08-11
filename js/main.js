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


/*----- cached element references -----*/

const dealBtn = document.querySelector('#deal');
const hitBtn = document.querySelector('#hit');
const stayBtn = document.querySelector('#stay');
const doubleBtn = document.querySelector('#double');
const playAgainBtn = document.querySelector('#play-again');
// const dealerHandEl = document.querySelector()
// need to cache input for bet


/*----- event listeners -----*/
dealBtn.addEventListener('click', function (e) {
    deal();
});
hitBtn.addEventListener('click', function (e) {
    hit();
});
stayBtn.addEventListener('click', function (e) {
    console.log('stay');
});
doubleBtn.addEventListener('click', function (e) {
    console.log('double');
});
playAgainBtn.addEventListener('click', function (e) {
    console.log('play again');
});


/*----- functions -----*/

function init () {
    playerHand = [];
    dealerHand = [];
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
    dealPlayerCard();
    dealDealerCard();
    dealPlayerCard();
    dealDealerCard();
    getHandTotals();
    // if (playerHandTotal === 21){
    //     // renderMessage.blackjack;
    // } else {
    //     //renderMessage.currentTotals;
    // }
}

function dealPlayerCard() {
    playerHand.push(shuffledDeck.pop());
}

function dealDealerCard() {
    dealerHand.push(shuffledDeck.pop());
}

function hit() {
    if(playerHandTotal <= 21) {
        dealPlayerCard();
    }
    getHandTotals();
}

// function stay() {
//     dealerPlay();
// }

// function double() {
//     if(playerHand.length === 2 && playerBalance >= bet * 2) {
//         bet = bet * 2;
//         dealPlayerCard();
//     } else return;

function getHandTotals () {
    playerHandTotal = playerHand[0].value + playerHand[1].value;
    for (let i = 2; i < playerHand.length; i++) {
        playerHandTotal += playerHand[i].value;
    }

    dealerHandTotal = dealerHand[0].value + dealerHand[1].value;
    for (let i = 2; i < dealerHand.length; i++) {
        dealerHandTotal += dealerHand[i].value;
    }

}

// function dealerPlay() {

// }

// function playAgain() {

// }

// function render() {

// }

init()

