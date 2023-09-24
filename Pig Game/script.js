'use strict';

const gameData = {
  currentScores: [0, 0],
  totalScores: [0, 0],
  activePlayer: 0,
  dice: 0,
  isEnded: false,
};

const gameDOM = {
  refreshActivePlayer: function () {
    // remove --active modifier
    const players = document.querySelectorAll('.player');
    for (const player of players) {
      player.classList.remove('player--active');
    }

    // add --active to desired player
    document
      .querySelector(`.player--${gameData.activePlayer}`)
      .classList.add('player--active');
  },

  refreshCurrentScores: function () {
    for (let i = 0; i < 2; i++) {
      document.querySelector(`#current--${i}`).textContent =
        gameData.currentScores[i];
    }
  },

  refreshTotalScores: function () {
    for (let i = 0; i < 2; i++) {
      document.querySelector(`#score--${i}`).textContent =
        gameData.totalScores[i];
    }
  },

  refreshDice: function () {
    const dice = document.querySelector('.dice');
    if ([1, 2, 3, 4, 5, 6].includes(gameData.dice)) {
      dice.setAttribute('src', `./assets/dice-${gameData.dice}.png`);
      dice.classList.remove('hidden');
    } else {
      dice.classList.add('hidden');
    }
  },

  changeStyle: function (styleType) {
    switch (styleType) {
      case 'end_game':
        const victoriousPlayer = document.querySelector('.player--active');
        victoriousPlayer.classList.remove('player--active');
        victoriousPlayer.classList.add('player--winner');
        break;
      case 'reset':
      default:
        const players = document.querySelectorAll('.player');
        for (const player of players) {
          player.classList.remove('player--winner');
        }
        break;
    }
  },
};

const resetGame = () => {
  // reset scores
  gameData.currentScores = [0, 0];
  gameData.totalScores = [0, 0];
  gameDOM.refreshCurrentScores();
  gameDOM.refreshTotalScores();

  // reset active player
  gameData.activePlayer = 0;
  gameDOM.refreshActivePlayer();

  // reset dice
  gameData.dice = 0;
  gameDOM.refreshDice();

  // reset game end status
  gameData.isEnded = false;

  // reset styles
  gameDOM.changeStyle('reset');
};

// handler functions
const handleNewGame = (event) => {
  resetGame();
};

const handleRollDice = (event) => {
  // test if the game ended
  if (gameData.isEnded) return;

  // roll the dice
  gameData.dice = Math.floor(Math.random() * 6) + 1;
  gameDOM.refreshDice();

  // if dice === 1 reset current score
  // else accumulate current score
  if (gameData.dice === 1) {
    // reset current score
    gameData.currentScores[gameData.activePlayer] = 0;
    gameDOM.refreshCurrentScores();

    // switch the active player
    gameData.activePlayer = gameData.activePlayer ? 0 : 1;
    gameDOM.refreshActivePlayer();
  } else {
    // update current score
    gameData.currentScores[gameData.activePlayer] += gameData.dice;
    gameDOM.refreshCurrentScores();
  }
};

const handleHold = (event) => {
  // test if the game ended
  if (gameData.isEnded) return;

  // transfer current score to total score
  gameData.totalScores[gameData.activePlayer] +=
    gameData.currentScores[gameData.activePlayer];
  gameDOM.refreshTotalScores();

  // clean current score
  gameData.currentScores[gameData.activePlayer] = 0;
  gameDOM.refreshCurrentScores();

  // if score is >=100 end the game
  // else switch players
  if (gameData.totalScores[gameData.activePlayer] >= 10) {
    // logically end the game
    gameData.isEnded = true;

    // remove dice
    gameData.dice = 0;
    gameDOM.refreshDice();

    //change styling
    gameDOM.changeStyle('end_game');
  } else {
    gameData.activePlayer = gameData.activePlayer ? 0 : 1;
    gameDOM.refreshActivePlayer();
  }
};

// initialize the game
resetGame();
document.querySelector('.btn--new').addEventListener('click', handleNewGame);
document.querySelector('.btn--roll').addEventListener('click', handleRollDice);
document.querySelector('.btn--hold').addEventListener('click', handleHold);
