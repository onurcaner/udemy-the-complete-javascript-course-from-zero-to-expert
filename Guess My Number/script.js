'use strict';

const gameData = {
  secretNumber: 0,
  score: 0,
  highscore: 0,
  isFinished: false,
};

const gameDOM = {
  hideSecretNumber: function () {
    document.querySelector('.number').textContent = '?';
  },
  revealSecretNumber: function () {
    document.querySelector('.number').textContent = gameData.secretNumber;
  },
  changeMessage: function (message) {
    document.querySelector('.message').textContent = message;
  },
  getGuessedValue: function () {
    return Number(document.querySelector('.guess').value);
  },
  setGuessValue: function (value) {
    document.querySelector('.guess').value = value;
  },
  changeScore: function () {
    document.querySelector('.score').textContent = gameData.score;
  },
  changeHighscore: function () {
    document.querySelector('.highscore').textContent = gameData.highscore;
  },
  changeStyle: function (styleType) {
    switch (styleType) {
      case 'victory':
        document.querySelector('body').style.backgroundColor = '#37b24d';
        document.querySelector('.number').style.width = '30rem';
        break;
      case 'defeat':
        document.querySelector('body').style.backgroundColor = '#f03e3e';
        document.querySelector('.number').style.width = '30rem';
        break;
      case 'reset':
      default:
        document.querySelector('body').style.backgroundColor = '';
        document.querySelector('.number').style.width = '';
        break;
    }
  },
};

const resetTheGame = () => {
  // change guess my number to ?
  gameDOM.hideSecretNumber();

  // clean up the input field
  gameDOM.setGuessValue('');

  // change the message to "Start guessing..."
  gameDOM.changeMessage('Start guessing...');

  // calculate the new secret number
  gameData.secretNumber = Math.floor(Math.random() * 20) + 1;

  // reset score
  gameData.score = 20;
  gameDOM.changeScore();

  // change isFinished
  gameData.isFinished = false;

  // change stylings
  gameDOM.changeStyle('reset');
};

const handleAgainButton = (event) => {
  resetTheGame();
};

const handleCheckButton = (event) => {
  // test if the game is isFinished
  if (gameData.isFinished) {
    return;
  }

  // no guessed number
  if (!gameDOM.getGuessedValue()) {
    gameDOM.changeMessage('No Number!');
    return;
  }

  // guessed number is correct
  if (gameDOM.getGuessedValue() === gameData.secretNumber) {
    gameDOM.changeMessage('Correct Number!');

    // reveal the secret number
    gameDOM.revealSecretNumber();

    // change the highscore
    if (gameData.score > gameData.highscore) {
      gameData.highscore = gameData.score;
      gameDOM.changeHighscore();
    }

    // finish the game
    gameData.isFinished = true;

    // change stylings
    gameDOM.changeStyle('victory');

    return;
  }

  // guessed number is not correct
  gameData.score--;
  gameDOM.changeScore();

  // if score is zero, finish the game
  if (!gameData.score) {
    gameDOM.changeMessage('You lost the game!');
    gameData.isFinished = true;

    // reveal the secret number
    gameDOM.revealSecretNumber();

    // change stylings
    gameDOM.changeStyle('defeat');
    return;
  }

  // compare guessed number with secret number
  gameDOM.changeMessage(
    gameDOM.getGuessedValue() > gameData.secretNumber ? 'Too High!' : 'Too Low!'
  );
};

// initialize the game
resetTheGame();
document
  .querySelector('.btn.check')
  .addEventListener('click', handleCheckButton);
document
  .querySelector('.btn.again')
  .addEventListener('click', handleAgainButton);
