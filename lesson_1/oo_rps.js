/*
!! Step 1: Write a textual description of the problem or exercise !!

Rock, paper, scissors is a two player game in which each player chooses between
rock, paper, or scissors. The winner is chosen by comparing their moves with the
following rules:

-Rock beats scissors
-Scissors beat paper
-Paper beats rock
-If the player chooses the same move, the game is a tie.

!! Step 2: Extract the significant NOUNS and VERBS from the description. !!

Nouns: Player, move, rule
Verbs: Choose, compare

!! Step 3: Organize and associate the verbs with the nouns. !!

Player:
  - choose
Move
Rule

???
- compare

*/
const readline = require('readline-sync');
const POINTS_TO_WIN = 5;

function createPlayer() {
  return {
    move: null,
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      const choices = ['rock', 'paper', 'scissors'];
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
    },
  };

  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      console.log('Choose from rock, paper, or scissors:');
      let choice = readline.question();

      while (!['rock', 'paper', 'scissors'].includes(choice)) {
        console.log('Sorry, invalid choice.');
        choice = readline.question();
      }

      this.move = choice;
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
      console.log(`Human: ${this.human} Computer: ${this.computer}`);
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
    console.log('Welcome to Rock, Paper, Scissors!');
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper Scissors. Goodbye!');
  },

  determineWinnerOfRound() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
      (humanMove === 'paper' && computerMove === 'rock') ||
      (humanMove === 'scissors' && computerMove === 'paper')) {
      this.winnerOfRound = 'human';
    } else if ((computerMove === 'rock' && humanMove === 'scissors') ||
        (computerMove === 'paper' && humanMove === 'rock') ||
        (computerMove === 'scissors' && humanMove === 'paper')) {
      this.winnerOfRound = 'computer';
    } else {
      this.winnerOfRound = 'null';
    }
  },

  displayWinnerOfRound() {
    console.log(`You chose ${this.human.move}.`);
    console.log(`Computer chose ${this.computer.move}.`);

    if (this.winnerOfRound === 'human') {
      console.log('You win!');
    } else if (this.winnerOfRound === 'computer') {
      console.log('You lose.');
    } else {
      console.log(`It's a tie.`);
    }
  },

  nextRound() {
    console.log('Press enter to begin the next round.');
    readline.question();
  },

  displayWinnerOfGame() {
    if (this.scoreboard['human'] === POINTS_TO_WIN) {
      console.log('You win the game!');
    } else if (this.scoreboard['computer'] === POINTS_TO_WIN) {
      console.log('Computer wins the game!');
    }
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {

      while (true) {
        this.human.choose();
        this.computer.choose();
        this.determineWinnerOfRound();
        this.displayWinnerOfRound();
        this.scoreboard.addPointToPlayer(this.winnerOfRound);
        this.scoreboard.displayScoreboard();
        if (this.scoreboard.playerReachesPointsToWin()) break;
        this.nextRound();
      }

      this.displayWinnerOfGame();
      if (!this.playAgain()) break;
      this.scoreboard.resetScoreboard();
    }

    this.displayGoodbyeMessage();
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question();
    return answer.toLowerCase()[0] === 'y';
  },
};

RPSGame.play();