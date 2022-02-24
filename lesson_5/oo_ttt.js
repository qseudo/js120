const readline = require('readline-sync');

class Square {
  static UNUSED_SQUARE = ' ';
  static HUMAN_MARKER = 'X';
  static COMPUTER_MARKER = 'O';

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }

  getMarker() {
    return this.marker;
  }
}

class Board {
  static MIDDLE_SQUARE = '5';
  static NUMBER_OF_SPACES_IN_ROW = 3;

  constructor() {
    this.reset();
  }

  reset() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[`${counter}`] = new Square();
    }
  }

  display() {
    console.log(``);
    console.log(`     |     |`);
    console.log(`  ${this.squares['1']}  |  ${this.squares['2']}  |  ${this.squares['3']}`);
    console.log(`     |     |`);
    console.log(`-----+-----+-----`);
    console.log(`     |     |`);
    console.log(`  ${this.squares['4']}  |  ${this.squares['5']}  |  ${this.squares['6']}`);
    console.log(`     |     |`);
    console.log(`-----+-----+-----`);
    console.log(`     |     |`);
    console.log(`  ${this.squares['7']}  |  ${this.squares['8']}  |  ${this.squares['9']}`);
    console.log(`     |     |`);
    console.log(``);
  }

  displayWithClear() {
    console.clear();
    console.log('');
    this.display();
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  isUnusedSquare(square) {
    return this.unusedSquares().includes(square);
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }

  static POSSIBLE_WINNING_ROWS = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["1", "4", "7"],
    ["2", "5", "8"],
    ["3", "6", "9"],
    ["1", "5", "9"],
    ["3", "5", "7"],
  ]

  static joinOr (choices, delimiter = ', ', word = 'or') {
    if (choices.length === 1) return `${choices[0]}`;
    if (choices.length === 2) return `${choices[0]} ${word} ${choices[1]}`;

    let result = '';
    const lastElementIndex = choices.length - 1;

    result += choices.slice(0, lastElementIndex).join(delimiter);
    result += `${delimiter}${word} ${choices[lastElementIndex]}`;
    return result;
  }

  play() {
    this.displayWelcomeMessage();

    while (true) {
      this.playRound();

      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  }

  playAgain() {
    let answer;

    while (true) {
      answer = readline.question('Play again? (Y or N):').toLowerCase();
      if (['y', 'n'].includes(answer)) break;

      console.log('Invalid input!');
    }

    return answer === "y";
  }

  playRound() {
    this.board.reset();
    this.board.display();

    while (true) {
      this.humanMoves();
      if (this.gameOver()) break;

      this.computerMoves();
      if (this.gameOver()) break;

      this.board.displayWithClear();
    }

    this.board.displayWithClear();
    this.displayResults();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Tic Tac Toe!');
  }

  displayGoodbyeMessage() {
    console.log('Thanks for playing Tic Tac Toe! Goodbye!');
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${TTTGame.joinOr(validChoices)}):`;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry that's not a valid choice.");
      console.log('');
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  findAtRiskSquare(player) {
    const atRiskRows = this.findAtRiskRows(player);

    const atRiskSquare = atRiskRows.flat().find(square => {
      return this.board.isUnusedSquare(square);
    });

    return atRiskSquare;
  }

  findAtRiskRows(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.filter(rows => {
      return this.board.countMarkersFor(player, rows) ===
        (Board.NUMBER_OF_SPACES_IN_ROW - 1);
    });
  }

  computerDefensiveMove() {
    return this.findAtRiskSquare(this.human);
  }

  computerOffensiveMove() {
    return this.findAtRiskSquare(this.computer);
  }

  computerMoves() {
    let choice = this.computerOffensiveMove() || this.computerDefensiveMove() ||
      this.chooseMiddleSquare() || this.chooseRandomSquare();
    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  chooseRandomSquare() {
    let validChoices = this.board.unusedSquares();
    let choice;

    do {
      choice = Math.floor((Object.keys(this.board.squares).length *
        Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));

    return choice;
  }

  chooseMiddleSquare() {
    return this.board.squares[Board.MIDDLE_SQUARE].isUnused() ?
      Board.MIDDLE_SQUARE : null;
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log('You won! Congratulations!');
    } else if (this.isWinner(this.computer)) {
      console.log('I won! I won! Take that, human!');
    } else {
      console.log('A tie game. How boring.');
    }
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) ===
        Board.NUMBER_OF_SPACES_IN_ROW;
    });
  }
}

let game = new TTTGame();
game.play();