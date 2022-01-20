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

  displayWinnerOfRound() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose ${this.human.move}.`);
    console.log(`Computer chose ${this.computer.move}.`);

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
      (humanMove === 'paper' && computerMove === 'rock') ||
      (humanMove === 'scissors' && computerMove === 'paper')) {
      console.log('You win!');
      this.winnerOfRound = 'human';
    } else if ((computerMove === 'rock' && humanMove === 'scissors') ||
        (computerMove === 'paper' && humanMove === 'rock') ||
        (computerMove === 'scissors' && humanMove === 'paper')) {
      console.log('You lose!');
      this.winnerOfRound = 'computer';
    } else {
      console.log(`It's a tie.`);
      this.winnerOfRound = 'null';
    }
  },

  updateScoreboard() {
    if (this.winnerOfRound === 'human') {
      this.scoreboard['human'] += 1;
    } else if (this.winnerOfRound === 'computer') {
      this.scoreboard['computer'] += 1;
    }
  },

  displayScoreboard() {
    console.log(`Player: ${this.scoreboard['human']} Computer: ${this.scoreboard['computer']}`);
  },

  nextRound() {
    console.log('Press enter to begin the next round.');
    readline.question();
  },

  displayWinnerOfGame() {
    if (this.scoreboard['human'] === 5) {
      console.log('You win the game!');
    } else if (this.scoreboard['computer'] === 5) {
      console.log('Computer wins the game!');
    }
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      while (true) {
        this.human.choose();
        this.computer.choose();
        this.displayWinnerOfRound();
        this.updateScoreboard();
        this.displayScoreboard();
        if (Object.values(this.scoreboard).includes(POINTS_TO_WIN)) break;
        this.nextRound();
      }
      this.displayWinnerOfGame();
      if (!this.playAgain()) break;
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