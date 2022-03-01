const readline = require('readline-sync');
const MAX_BEFORE_BUST = 21;

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

  reset() {
    this.hand = [];
    this.bust = false;
  }

  calculateTotal() {
    let sum = this.hand.reduce((acc, val) => acc + val.value, 0);
    if (this.hand.find(card => card.rank === 'ACE') && (sum + Card.ACE_EXTRA_VALUE <= MAX_BEFORE_BUST)) {
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

    console.log(resultString);
  }

  hasBusted() {
    return this.bust;
  }

  checkForBust() {
    if (this.calculateTotal() > MAX_BEFORE_BUST) this.bust = true;
  }
}

class Player extends Participant {
  constructor() {
    super();
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
  }

  play() {
    console.clear();
    this.displayWelcomeMessage();
    this.dealCards();
    this.playersTurn();
    if (!this.player.hasBusted()) this.dealersTurn();
    this.displayResults();
    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {
    console.log('Welcome to Twenty One!');
  }

  displayGoodbyeMessage() {
    console.log('Thanks for playing Twenty One! Goodbye.');
  }

  dealCards() {
    this.deck.dealACard(this.player);
    this.deck.dealACard(this.dealer);
    this.deck.dealACard(this.player);
    this.deck.dealACard(this.dealer);
  }

  showParticipantsCards() {
    console.log(`Player's cards:`);
    this.player.showCardsInHand();
    console.log('');
    console.log(`Dealer's cards:`);
    this.dealer.showFirstCardAndNumberOfCards();
    console.log('');
  }

  showCardsWithClear() {
    console.clear();
    this.showParticipantsCards();
  }

  revealParticipantsCards() {
    this.player.showCardsInHand();
    console.log(this.player.calculateTotal());
    this.dealer.showCardsInHand();
    console.log(this.dealer.calculateTotal());
  }

  playersTurn() {
    this.showParticipantsCards();

    while (true) {
      let answer;
      while (true) {
        answer = readline.question(`Hit or stay?`).toLowerCase();
        if (answer === 'h' || answer === 's' || answer === 'hit' || answer === 'stay') break;
        console.log(`Invalid answer!`);
      }
      if (answer === 's' || answer === 'stay') {
        console.log('Player chooses [STAY].');
        break;
      }
      console.log('Player chooses [HIT].');
      this.deck.dealACard(this.player);
      this.player.checkForBust();
      if (this.player.hasBusted()) break;
      this.showCardsWithClear();
    }
  }

  dealersTurn() {
    this.showCardsWithClear();

    while (this.dealer.calculateTotal() < Dealer.MIN_TO_STAY) {
      console.log('Dealer chooses [HIT].');
      this.deck.dealACard(this.dealer);
      this.dealer.checkForBust();
      if (this.dealer.hasBusted()) break;
      this.showCardsWithClear();
    }
    if (!this.dealer.hasBusted()) console.log('Dealer chooses [STAY].');
  }

  displayResults() {
    this.revealParticipantsCards();
    if (this.player.hasBusted()) {
      console.log('Player busted!');
    } else if (this.dealer.hasBusted()) {
      console.log('Dealer busted!');
    } else if (this.player.calculateTotal() < this.dealer.calculateTotal()) {
      console.log('Dealer wins!');
    } else if (this.player.calculateTotal() > this.dealer.calculateTotal()) {
      console.log('Player wins!');
    } else {
      console.log(`It's a tie.`);
    }
    // stub
    // if human bust, dealer win
    // if dealer bust, human win
    // else if player hand > dealer hand, human win
    // else if player hand < dealer hand, dealer wins
  }
}

let game = new TwentyOneGame();
game.play();