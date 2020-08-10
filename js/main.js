// Blackjack Project

// ========  Psueocode  =========
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

// will be the deck but not sure how to build with the css cards

/*----- app's state (variables) -----*/

let playerBalance;
let playerHand;
let dealerHand;
let playerBet;


/*----- cached element references -----*/

const dealBtn = document.querySelector('#deal');
const hitBtn = document.querySelector('#hit');
const stayBtn = document.querySelector('#stay');
const doubleBtn = document.querySelector('#double');
const playAgainBtn = document.querySelector('#play-again');
// need to cache input for bet


/*----- event listeners -----*/
dealBtn.addEventListener('click', function (e) {
    console.log('deal');
});
hitBtn.addEventListener('click', function (e) {
    console.log('hit');
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
    playerBalance = 500;
    playerHand = [];
    dealerHand = [];
    // playerBet = input from player

    // render ();
}