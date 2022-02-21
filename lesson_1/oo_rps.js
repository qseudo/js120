/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

const readline = require('readline-sync');
const POINTS_TO_WIN = 5;
const CHOICES_TABLE = {
  rock: {
    winningCombos: ['lizard', 'scissors'],
    inputs: ['r', 'ro', 'rock'],
  },
  paper: {
    winningCombos: ['rock', 'spock'],
    inputs: ['p', 'pa', 'paper'],
  },
  scissors: {
    winningCombos: ['paper', 'lizard'],
    inputs: ['sc', 'scissors'],
  },
  lizard: {
    winningCombos: ['spock', 'paper'],
    inputs: ['l', 'li', 'lizard'],
  },
  spock: {
    winningCombos: ['scissors', 'rock'],
    inputs: ['sp', 'spock'],
  },
};

const TITLE = Object.keys(CHOICES_TABLE).map(choice => {
  return choice[0].toUpperCase() + choice.slice(1);
}).join(' ');

const MIN_PERCENTAGE_OF_LOSSES_TO_ADJUST_MOVE = 60;

function createPlayer() {
  return {
    move: null,
    moveAndWinnerHistory: {
      rock: [],
      paper: [],
      scissors: [],
      lizard: [],
      spock: [],
    },

    updateMoveAndWinnerHistory(move, winnerOfRound) {
      this.moveAndWinnerHistory[move].push(winnerOfRound);
    },
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      let computerChoices;
      let losingMoves = this.findLosingMoves();

      if (losingMoves.length === 0) {
        computerChoices = Object.keys(CHOICES_TABLE);
      } else {
        let preferredMoves = this.findPreferredMoves(losingMoves);
        computerChoices = Object.keys(CHOICES_TABLE).concat(preferredMoves);
      }

      let randomIndex = Math.floor(Math.random() * computerChoices.length);
      this.move = computerChoices[randomIndex];
    },

    findLosingMoves() {
      return Object.keys(this.moveAndWinnerHistory).filter(move => {
        let numOfLosses = this.moveAndWinnerHistory[move].filter(winner => winner === 'human').length;
        let numOfTimesMoveUsed = this.moveAndWinnerHistory[move].length;
        let percentageOfLosses = (numOfLosses / numOfTimesMoveUsed) * 100;
        return percentageOfLosses >= MIN_PERCENTAGE_OF_LOSSES_TO_ADJUST_MOVE;
      });
    },

    findPreferredMoves(losingMoves) {
      return Object.keys(CHOICES_TABLE).filter(move => {
        return !losingMoves.includes(move);
      });
    },
  };
  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;
      let validChoices = Object.values(CHOICES_TABLE)
        .map(obj => obj.inputs)
        .flat();
      do {
        console.log(`Choose from ${Object.keys(CHOICES_TABLE).map(choice => `(${choice.slice(0, 2).toUpperCase()})` + choice.slice(2)).join(', ')}:`);
        choice = readline.prompt().toLowerCase();
        if (validChoices.includes(choice)) break;
        console.log('Sorry, invalid choice.');
      } while (true);

      this.move = Object.keys(CHOICES_TABLE).filter(move => {
        return CHOICES_TABLE[move].inputs.includes(choice);
      })[0];
    },

    displayLossPercentageOfEachMove() {
      const lossPercentages = Object.keys(this.moveAndWinnerHistory)
        .map(move => {
          const numOfLosses = this.moveAndWinnerHistory[move].filter(winner => winner === 'computer').length;
          const numOfTimesMoveUsed = this.moveAndWinnerHistory[move].length;
          if (numOfTimesMoveUsed === 0) return `${move[0].toUpperCase() + move.slice(1)}: 0%`;
          const lossPercentage = (numOfLosses / numOfTimesMoveUsed) * 100;
          return `${move[0].toUpperCase() + move.slice(1)}: ${lossPercentage.toFixed(0)}%`;
        }).join(', ');
      const topBottomBorder = '-'.repeat(lossPercentages.length);

      console.log(topBottomBorder);
      console.log('Human losing rates of each move:');
      console.log(lossPercentages);
      console.log(topBottomBorder);
    },
  };

  return Object.assign(playerObject, humanObject);
}

function createScoreboard() {
  return {
    human: 0,
    computer: 0,

    addPointToPlayer(winnerOfRound) {
      this[winnerOfRound] += 1;
    },

    displayScoreboard() {
      const message = `|| Human: ${this.human} Computer: ${this.computer} ||`;
      const topBottomBorder = `=`.repeat(message.length);
      console.log(topBottomBorder);
      console.log(message);
      console.log(topBottomBorder);
    },

    resetScoreboard() {
      this.human = 0;
      this.computer = 0;
    },

    playerReachesPointsToWin() {
      return this.human === POINTS_TO_WIN || this.computer === POINTS_TO_WIN;
    },
  };
}

// Orchestration engine => engine is where the procedural program flow should be
const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  scoreboard: createScoreboard(),
  winnerOfRound: null,

  displayWelcomeMessage() {
    let message = `|| Welcome to ${TITLE}! ||`;
    let topBottomBorder = '~'.repeat(message.length);

    console.log(topBottomBorder);
    console.log(message);
    console.log(topBottomBorder);
  },

  displayInstructions() {
    console.log('\n');
    Object.keys(CHOICES_TABLE).forEach(key => {
      const winningCombos = CHOICES_TABLE[key].winningCombos
        .map(move => move.toUpperCase());
      console.log(`${key.toUpperCase()} beats ${winningCombos.join(' and ')}.`);
    });
    console.log('\nFirst to 5 points wins!\n');
    this.continue();
  },

  displayGoodbyeMessage() {
    console.log(`Thanks for playing ${TITLE}. Goodbye!`);
  },

  determineWinnerOfRound() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (CHOICES_TABLE[humanMove].winningCombos.includes(computerMove)) {
      this.winnerOfRound = 'human';
    } else if (CHOICES_TABLE[computerMove].winningCombos.includes(humanMove)) {
      this.winnerOfRound = 'computer';
    } else {
      this.winnerOfRound = null;
    }
  },

  displayWinnerOfRound() {
    console.log(`You chose ${this.human.move.toUpperCase()}.`);
    console.log(`Computer chose ${this.computer.move.toUpperCase()}.`);

    if (this.winnerOfRound === 'human') {
      console.log('You win!');
    } else if (this.winnerOfRound === 'computer') {
      console.log('You lose.');
    } else {
      console.log(`It's a tie.`);
    }
  },

  updatePlayersMoveAndWinnerHistory() {
    this.human.updateMoveAndWinnerHistory(this.human.move, this.winnerOfRound);
    this.computer
      .updateMoveAndWinnerHistory(this.computer.move, this.winnerOfRound);
  },

  continue() {
    console.log('Press enter to continue.');
    readline.prompt();
    console.clear();
  },

  displayWinnerOfGame() {
    if (this.scoreboard['human'] === POINTS_TO_WIN) {
      console.log('You win the game!');
    } else if (this.scoreboard['computer'] === POINTS_TO_WIN) {
      console.log('Computer wins the game!');
    }
  },

  play() {
    console.clear();
    this.displayWelcomeMessage();
    this.displayInstructions();
    while (true) {
      while (true) {
        this.scoreboard.displayScoreboard();
        this.human.displayLossPercentageOfEachMove();
        this.human.choose();
        this.computer.choose();
        this.determineWinnerOfRound();
        this.displayWinnerOfRound();
        this.updatePlayersMoveAndWinnerHistory();
        this.scoreboard.addPointToPlayer(this.winnerOfRound);
        if (this.scoreboard.playerReachesPointsToWin()) {
          this.continue();
          break;
        }
        this.continue();
      }
      this.scoreboard.displayScoreboard();
      this.displayWinnerOfGame();
      if (!this.playAgain()) break;
      this.scoreboard.resetScoreboard();
      console.clear();
    }

    this.displayGoodbyeMessage();
  },

  playAgain() {
    let answer;
    do {
      console.log('Would you like to play again? (yes/no)');
      answer = readline.prompt().toLowerCase();
      if (answer === "yes" || answer === "no") break;
      console.log('Sorry, invalid answer.');
    } while (true);

    return answer === 'yes';
  },
};

RPSGame.play();