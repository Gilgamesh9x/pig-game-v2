"use strict";
// All the variables we need

const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");
const btnNew = document.querySelector(".btn--new");
const paragraph = document.querySelector(".paragraph");
const maxScore = document.querySelector(".max-score");
const select = document.querySelector(".select");

const title = document.querySelector("h1");
const diceDisplay = document.querySelector(".dice");
const diceImage = document.querySelector("img");
// this selects both players
const selectPlayers = document.querySelectorAll("section");
const playerOne = document.querySelector(".player--0");
const playerTwo = document.querySelector(".player--1");
const player1Score = document.querySelector(".score--0");
const player2Score = document.querySelector(".score--1");
// score of both players
const score = document.querySelectorAll(".score");
// current score of both players (we'll use it for the reset)
const currentScore = document.querySelectorAll(".current-score");

// we put them here so when the value won't get reset
let scoreOne = 0;
let scoreTwo = 0;
let maxPoints;
////////////////////////////////////////////////////////////////

// Player's turn

function playerTurn() {
  // if condition to change the title to the active player:
  playerOne.classList.contains("player--active")
    ? (title.textContent = "Player's 1 turn...")
    : (title.textContent = "Player's 2 turn...");
}

/////

function switchPlayersAndSaveScore() {
  // this will update itself everytime we trigger the event listener. If we put it outside the function, it will only save 1 value (of one player) and won't move to then ext player
  const currentScore = document.querySelector(".player--active .current-score");
  // because this is not constant, we need to put it inside the func
  const playerScore = document.querySelector(".player--active .score");

  selectPlayers.forEach((player) => {
    // we select the score value here (when the player gets 1)
    if (player.classList.contains("player--active")) {
      // save the score in each player
      if (playerScore.classList.contains("score--0")) {
        scoreOne += Number(currentScore.textContent);
        player1Score.textContent = scoreOne;
      } else {
        scoreTwo += Number(currentScore.textContent);
        player2Score.textContent = scoreTwo;
      }

      // if the player already has it, remove it
      player.classList.remove("player--active");
      currentScore.textContent = 0;
      playerTurn();
    } else {
      // if the player doesn't have the style, use it
      player.classList.add("player--active");
      playerTurn();
    }
  });
}

///////////////////////////////////////////////////////////////

function pigGame() {
  playerOne.classList.add("player--active");
  // Roll event listener
  btnRoll.addEventListener("click", btnRollHandler);

  function btnRollHandler() {
    let randomDice = Math.floor(Math.random() * 6 + 1);
    // choose the image
    diceImage.setAttribute("src", `./images/dice-${randomDice}.png`);
    // this will display the image (remove the display:none;)
    diceDisplay.classList.remove("hide");
    // we left this here because we need it at the else statemnt of if randomd = 1
    const currentScore = document.querySelector(
      ".player--active .current-score"
    );

    // if we get 1, we switch players
    if (randomDice === 1) {
      currentScore.textContent = 0;
      // we split the score of the player to have
      if (playerOne.classList.contains("player--active")) {
        scoreOne /= 2;
      } else {
        scoreTwo /= 2;
      }
      switchPlayersAndSaveScore();
    } else {
      currentScore.textContent = Number(currentScore.textContent) + randomDice;
    }
  }

  // hold event listener

  btnHold.addEventListener("click", btnHoldHandler);

  function btnHoldHandler() {
    switchPlayersAndSaveScore();
    if (scoreOne >= maxPoints) {
      playerOne.classList.add("player--winner");
      btnRoll.removeEventListener("click", btnRollHandler);
      btnHold.removeEventListener("click", btnHoldHandler);
      diceDisplay.classList.add("hide");
      title.textContent = "Player 1 wins! Congratulations";
      // we'll add this here so that the player can change the value of max score if they want
      select.addEventListener("click", selectMaxValue);
      select.classList.remove("not-allowed");
      paragraph.textContent = "Select a new max value again";
    } else if (scoreTwo >= maxPoints) {
      playerTwo.classList.add("player--winner");
      btnRoll.removeEventListener("click", btnRollHandler);
      btnHold.removeEventListener("click", btnHoldHandler);
      diceDisplay.classList.add("hide");
      title.textContent = "Player 2 wins! Congratulations!";
      select.addEventListener("click", selectMaxValue);
      select.classList.remove("not-allowed");
      paragraph.textContent = "Select a new max value again";
    }
  }
}

// Start and Reset game:

function resetStartgame() {
  ///////////////// Reset functionality

  scoreOne = 0;
  scoreTwo = 0;
  // score of each player is set to 0
  score.forEach((element) => (element.textContent = 0));
  // current score of each player is set to 0
  currentScore.forEach((element) => (element.textContent = 0));

  // remove the winner style
  playerOne.classList.remove("player--winner");
  playerTwo.classList.remove("player--winner");

  // when the game restarts, player one always gets the player active
  playerOne.classList.add("player--active");
  playerTwo.classList.remove("player--active");

  // to delete the congratulations and add the active player instead
  playerTurn();

  // hide the dice
  diceDisplay.classList.add("hide");

  ///////////// Start functionality
  maxPoints = Number(maxScore.value);
  paragraph.textContent = `You win when you get ${maxPoints} points`;
  pigGame();
  // to change the text to the player's turn
  playerTurn();
  // no changing the max score when the game starts
  select.removeEventListener("click", selectMaxValue);
  btnNew.removeEventListener("click", resetStartgame);
  select.classList.add("not-allowed");
  btnNew.classList.add("not-allowed");
}

// Select max value

select.addEventListener("click", selectMaxValue);

function selectMaxValue() {
  // if the player leaves the input field empty or enters a 0, he can't start
  if (!maxScore.value || Number(maxScore.value) <= 0) {
    paragraph.textContent =
      "Choose a number that is over 0 and click new game.";
  } else {
    // when the player selects, remove the not allowed class
    btnNew.classList.remove("not-allowed");
    paragraph.textContent = `You win the game when you reach ${maxScore.value} points. Click new game to start`;
    btnNew.addEventListener("click", resetStartgame);
  }
}

// Rules:

const overlay = document.querySelector(".overlay");
const rulesDisplay = document.querySelector(".rules-display");
const rules = document.querySelector(".rules");
const closeModal = document.querySelector(".close-modal");

// click to show the rules page
rules.addEventListener("click", function () {
  overlay.classList.remove("hidden");
  rulesDisplay.classList.remove("hidden");
});

// click to remove rules page

closeModal.addEventListener("click", function () {
  rulesDisplay.classList.add("hidden");
  overlay.classList.add("hidden");
});

overlay.addEventListener("click", function () {
  rulesDisplay.classList.add("hidden");
  overlay.classList.add("hidden");
});
