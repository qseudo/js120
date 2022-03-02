const readline = require('readline-sync');

class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.value = Card.VALUES[this.rank];
  }

  static FACE_CARD_VALUE = 10;
  static ACE_EXTRA_VALUE = 10;
  static SUITS = ['HEARTS', 'SPADES', 'CLUBS', 'DIAMONDS'];
  static RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'];
  static VALUES = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    JACK: Card.FACE_CARD_VALUE,
    QUEEN: Card.FACE_CARD_VALUE,
    KING: Card.FACE_CARD_VALUE,
    ACE: 1,
  }

  isFaceCard() {
    return !(this.rank >= "2" && this.rank <= "10");
  }

  toString() {
    if (this.isFaceCard()) {
      return `${this.rank[0] + this.rank.slice(1).toLowerCase()}`;
    } else {
      return `${this.rank}`;
    }
  }
}

class Deck {
  constructor() {
    this.reset();
  }

  reset() {
    this.cards = [];

    for (let idx = 0; idx < Card.SUITS.length; idx += 1) {
      for (let jdx = 0; jdx < Card.RANKS.length; jdx += 1) {
        this.cards.push(new Card(Card.SUITS[idx], Card.RANKS[jdx]));
      }
    }

    this.shuffle(this.cards);
  }

  shuffle(cards) {
    for (let index = cards.length - 1; index > 0; index--) {
      let otherIndex = Math.floor(Math.random() * (index + 1)); // 0 to index
      [cards[index], cards[otherIndex]] = [cards[otherIndex], cards[index]]; // swap elements
    }
  }

  dealACard(participant) {
    let drawnCard = this.cards.shift();
    participant.hand.push(drawnCard);
  }
}

class Participant {
  constructor() {
    this.reset();
  }

  static MAX_BEFORE_BUST = 21;

  reset() {
    this.hand = [];
    this.bust = false;
  }

  calculateTotal() {
    let sum = this.hand.reduce((acc, val) => acc + val.value, 0);
    if (this.hand.find(card => card.rank === 'ACE') && (sum + Card.ACE_EXTRA_VALUE <= Participant.MAX_BEFORE_BUST)) {
      sum += Card.ACE_EXTRA_VALUE;
    }
    return sum;
  }

  joinAnd(array, delimiter = ', ', word = 'and') {
    if (array.length === 1) return `${array[0]}`;
    if (array.length === 2) return `${array[0]} ${word} ${array[1]}`;

    let resultString = ``;
    let idxOfLastElem = array.length - 1;

    let arrayCopyWithoutLastElem = array.slice(0, idxOfLastElem);
    resultString += arrayCopyWithoutLastElem.join(delimiter);
    resultString += `${delimiter}${word} ${array[idxOfLastElem]}`;

    return resultString;
  }

  showCardsInHand() {
    let resultString = '';

    let ranks = this.hand.map(card => card.toString());
    resultString += this.joinAnd(ranks);

    let total = ` | TOTAL: ${this.calculateTotal()}`;
    resultString += total;
    console.log(resultString);
  }

  hasBusted() {
    return this.bust;
  }

  checkForBust() {
    if (this.calculateTotal() > Participant.MAX_BEFORE_BUST) this.bust = true;
  }
}

class Player extends Participant {
  constructor() {
    super();
    this.wallet = Player.STARTING_CASH;
  }

  static STARTING_CASH = 5;

  isRich() {
    return this.wallet === 10;
  }

  isBroke() {
    return this.wallet === 0;
  }

  displayWallet() {
    let chars = `|  $${this.wallet}   |`;
    let border = '-'.repeat(chars.length);

    console.log(`[ Player's Wallet ]`);
    console.log(border);
    console.log(chars);
    console.log(border);
  }
}

class Dealer extends Participant {
  constructor() {
    super();
  }

  static MIN_TO_STAY = 17;

  showFirstCardAndNumberOfCards() {
    let resultString = '';
    let visibleCard = this.hand[0];
    let remainingCards = this.hand.slice(1);

    resultString += visibleCard.toString();

    if (remainingCards.length === 1) {
      resultString += ` and ${remainingCards.length} other card`;
    } else {
      resultString += ` and ${remainingCards.length} other cards.`;
    }

    console.log(resultString);
  }
}

class TwentyOneGame {
  constructor() {
    this.deck = new Deck();
    this.player = new Player();
    this.dealer = new Dealer();
    this.winner = null;
  }

  play() {
    console.clear();
    this.displayWelcomeMessage();
    while (true) {
      this.dealCards();
      this.playersTurn();
      if (!this.player.hasBusted()) this.dealersTurn();
      this.displayResults();
      if (this.gameOver()) break;
      this.nextRound();
      this.resetGame();
      console.clear();
    }
    this.displayWinnerOfMatch();
    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {
    console.log('! Welcome to TWENTY ONE !');
    console.log('Closest to 21 without going over wins the round.');
    console.log('It takes $1 to play a round.');
    console.log('If you hit $0, you lose.');
    console.log('If you reach $10, you win!');
    console.log('');
  }

  displayGoodbyeMessage() {
    console.log('Thanks for playing Twenty One! Goodbye.');
  }

  gameOver() {
    return this.player.isBroke() || this.player.isRich();
  }

  displayWinnerOfMatch() {
    if (this.player.isBroke()) {
      console.log('You have no more money! You lose the game.');
    } else if (this.player.isRich()) {
      console.log(`You're rich! You win the game!`);
    }
  }

  nextRound() {
    console.log('Ready for the next round? Enter any key to continue.');
    readline.prompt();
  }

  dealCards() {
    this.deck.dealACard(this.player);
    this.deck.dealACard(this.dealer);
    this.deck.dealACard(this.player);
    this.deck.dealACard(this.dealer);
  }

  showCardsAndWallet() {
    this.player.displayWallet();
    console.log('');
    console.log(`Player's cards:`);
    this.player.showCardsInHand();
    console.log('');
    console.log(`Dealer's cards:`);
    this.dealer.showFirstCardAndNumberOfCards();
    console.log('');
  }

  showCardsAndWalletWithClear() {
    console.clear();
    this.showCardsAndWallet();
  }

  revealParticipantsCards() {
    console.log(`Player's cards:`);
    this.player.showCardsInHand();
    console.log(`Dealer's cards:`);
    this.dealer.showCardsInHand();
  }

  playersTurn() {
    this.showCardsAndWallet();

    while (true) {
      let answer = this.promptPlayerForHitOrStay();
      if (answer === 's' || answer === 'stay') {
        console.log('Player chooses [STAY].');
        break;
      }
      this.deck.dealACard(this.player);
      this.player.checkForBust();
      if (this.player.hasBusted()) break;
      this.showCardsAndWalletWithClear();
      console.log('Player chooses [HIT].');
    }
  }

  promptPlayerForHitOrStay() {
    let answer;
    while (true) {
      console.log(`Hit or stay?`);
      answer = readline.prompt().toLowerCase();
      if (answer === 'h' || answer === 's' || answer === 'hit' || answer === 'stay') break;
      console.log(`Invalid answer!`);
    }
    return answer;
  }

  dealersTurn() {
    this.showCardsAndWalletWithClear();

    while (this.dealer.calculateTotal() < Dealer.MIN_TO_STAY) {
      this.deck.dealACard(this.dealer);
      this.dealer.checkForBust();
      if (this.dealer.hasBusted()) break;
      this.showCardsAndWalletWithClear();
    }
    let numOfCards = this.dealer.hand.length;
    if (numOfCards === 3) console.log(`Dealer chose [HIT] ${numOfCards - 2} time.`);
    if (numOfCards > 3) console.log(`Dealer chose [HIT] ${numOfCards - 2} times.`);
    if (!this.dealer.hasBusted()) console.log('Dealer chooses [STAY].');
  }

  displayResults() {
    console.log('');
    console.log('~~~ RESULTS ~~~');
    this.revealParticipantsCards();
    console.log('');
    this.determineWinner();
    this.displayWinner();
    this.player.displayWallet();
  }

  displayWinner() {
    if (this.winner === this.player) {
      console.log('Player wins! You get $1!');
      this.player.wallet += 1;
    } else if (this.winner === this.dealer) {
      console.log('Dealer wins! You lose $1.');
      this.player.wallet -= 1;
    } else {
      console.log(`It's a tie.`);
    }
  }

  determineWinner() {
    if (this.player.hasBusted()) {
      console.log('Player busted!');
      this.winner = this.dealer;
    } else if (this.dealer.hasBusted()) {
      console.log('Dealer busted!');
      this.winner = this.player;
    } else if (this.dealer.calculateTotal() > this.player.calculateTotal()) {
      console.log(`Dealer's hand beats Player's hand.`);
      this.winner = this.dealer;
    } else if (this.player.calculateTotal() > this.dealer.calculateTotal()) {
      console.log(`Player's hand beats Dealer's hand.`);
      this.winner = this.player;
    } else {
      console.log(`Both hands are equal in value.`);
    }
  }

  resetWinner() {
    this.winner = null;
  }

  resetGame() {
    this.deck.reset();
    this.player.reset();
    this.dealer.reset();
    this.resetWinner();
  }
}

let game = new TwentyOneGame();
game.play();