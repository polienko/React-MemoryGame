import React from "react";
import Board from './Board';
import './Game.css';

const DEBUG_MODE = false;

//IMPORT IMAGES TO OBJECT
let images = {};
for (let i = 1; i <= 24; i++) {
  let currentImage = require('../img/'+ i +'.png').default;
  Object.defineProperty(images, i, {
    __proto__: null,
    value: currentImage
  });
}
console.log(images);

/* // NOT WORKING
for (let prop in images){
  console.log(images[prop]);
}

for (const [key, path] of Object.entries(images)){
  console.log(path);
}
*/


let DEFAULT_CLASS = "card";
let MATCH_CLASS = "card match";
let FLIP_CLASS = "card flip";

if (DEBUG_MODE){
  DEFAULT_CLASS = "card_debug";
  MATCH_CLASS = "card_debug match_debug";
  FLIP_CLASS = "card_debug flip_debug";
}

const DEFAULT_GAMEMODE = 24;
const SHOW_SECOND_CARD_TIME = 500;

const SCORE_MOD_PLUS = 50;
const SCORE_MOD_MINUS = -10;

let UNIQUE_CARDS = [
  {data: "1", class: DEFAULT_CLASS, path: images[1]},
  {data: "2", class: DEFAULT_CLASS, path: images[2]},
  {data: "3", class: DEFAULT_CLASS, path: images[3]},
  {data: "4", class: DEFAULT_CLASS, path: images[4]},
  {data: "5", class: DEFAULT_CLASS, path: images[5]},
  {data: "6", class: DEFAULT_CLASS, path: images[6]},
  {data: "7", class: DEFAULT_CLASS, path: images[7]},
  {data: "8", class: DEFAULT_CLASS, path: images[8]},
  {data: "9", class: DEFAULT_CLASS, path: images[9]},
  {data: "10", class: DEFAULT_CLASS, path: images[10]},
  {data: "11", class: DEFAULT_CLASS, path: images[11]},
  {data: "12", class: DEFAULT_CLASS, path: images[12]},
  {data: "13", class: DEFAULT_CLASS, path: images[13]},
  {data: "14", class: DEFAULT_CLASS, path: images[14]},
  {data: "15", class: DEFAULT_CLASS, path: images[15]},
  {data: "16", class: DEFAULT_CLASS, path: images[16]},
  {data: "17", class: DEFAULT_CLASS, path: images[17]},
  {data: "18", class: DEFAULT_CLASS, path: images[18]},
  {data: "19", class: DEFAULT_CLASS, path: images[19]},
  {data: "20", class: DEFAULT_CLASS, path: images[20]},
  {data: "21", class: DEFAULT_CLASS, path: images[21]},
  {data: "22", class: DEFAULT_CLASS, path: images[22]},
  {data: "23", class: DEFAULT_CLASS, path: images[23]},
  {data: "24", class: DEFAULT_CLASS, path: images[24]},
];

let FULL_CARD_DECK = [];
UNIQUE_CARDS.map((card) => (
  FULL_CARD_DECK.push(card, Object.assign({}, card)))
);
let GAME_DECK = FULL_CARD_DECK.slice(0, DEFAULT_GAMEMODE * 2);
GAME_DECK = shuffleCards(GAME_DECK);

let MATCHES_TO_WIN = GAME_DECK.length / 2;
let BOARD_LOCKED = false;

if (localStorage.getItem("bestScoreFor_" + DEFAULT_GAMEMODE) === null){
  localStorage.setItem("bestScoreFor_" + DEFAULT_GAMEMODE, "0");
}

function shuffleCards(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function switchClassOnCards(from,to){
  for (const [key, card] of Object.entries(GAME_DECK)){
    if (card.class === from){
      card.class = to;
    }
  }
}
function resetClassOnAllCards(){
  for (const [key, card] of Object.entries(GAME_DECK)){
    card.class = DEFAULT_CLASS;
  }
}
function switchClassToFlipped(clickedCard){
  for (const [key, card] of Object.entries(GAME_DECK)){
    if(parseInt(key) === parseInt(clickedCard.props.index)){
      if (card.class === DEFAULT_CLASS){
        card.class = FLIP_CLASS;
      }
    }
  }
}
function outputLocalStorage(){
  if (DEBUG_MODE){
    let output = "localStorage: \n";
    for (let i = 0; i < localStorage.length; i++){
      output += " * " + localStorage.key(i) + " = [" + 
      localStorage.getItem(localStorage.key(i)) + "] \n";
    }
    console.log(output);
  }
}


class Game extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        gameID: 0,
        gameMode: GAME_DECK.length / 2,
        matches: 1,
        click:1,
        freezeCards:false,
        score: 0,
        bestScore: localStorage.getItem("bestScoreFor_" + DEFAULT_GAMEMODE)
      }
      this.changeScore = this.changeScore.bind(this);
      this.updateBestScore = this.updateBestScore.bind(this);
      this.newGame = this.newGame.bind(this);   
      this.clickHandler = this.clickHandler.bind(this); 
      this.clearBestScores = this.clearBestScores.bind(this);
      if (DEBUG_MODE){
        outputLocalStorage();
        console.log("GAME_DECK:\n", GAME_DECK);
      }  
    }

    newGame(event){
      event.preventDefault();
      let newGameMode = event.target.elements['gamemode'].value;

      resetClassOnAllCards();
      GAME_DECK = FULL_CARD_DECK.slice(0, newGameMode * 2);
      GAME_DECK = shuffleCards(GAME_DECK);
      MATCHES_TO_WIN = GAME_DECK.length / 2;

      this.setState({gameID: this.state.gameID + 1});
      this.setState({score: 0});
      this.setState({gameMode: GAME_DECK.length / 2});
      
      this.setState({matches: 1});
      if (localStorage.getItem("bestScoreFor_" + newGameMode) === null){
        localStorage.setItem("bestScoreFor_" + newGameMode,"0");
        this.setState({bestScore: localStorage.getItem("bestScoreFor_" + newGameMode)});
      } else {
        this.setState({bestScore: localStorage.getItem("bestScoreFor_" + newGameMode)});
      }
      if (DEBUG_MODE) {
        outputLocalStorage();
        console.log("GAME_DECK:\n", GAME_DECK);
      }
    }
    
    clearBestScores(){
      localStorage.clear();
      let currentGameMode = GAME_DECK.length / 2;
      if (localStorage.getItem("bestScoreFor_" + currentGameMode) === null){
        localStorage.setItem("bestScoreFor_" + currentGameMode,"0");
        this.setState({bestScore: localStorage.getItem("bestScoreFor_" + currentGameMode)});
      } else {
        this.setState({bestScore: localStorage.getItem("bestScoreFor_" + currentGameMode)});
      }
      if (DEBUG_MODE) {outputLocalStorage();}
    }

    clickHandler(clickedCard){
      if (clickedCard.props.class === MATCH_CLASS ||
          clickedCard.props.class === FLIP_CLASS ||
          BOARD_LOCKED) {
            return "CAN'T CLICK ON CARD";
      }

      this.setState({click: this.state.click + 1});

      switchClassToFlipped(clickedCard);
      
      if (this.state.click === 2) {
        // ADD CARDS TO CHECK
        let checkTheseCards=[];
        for (const [key, someCard] of Object.entries(GAME_DECK)){
            if (someCard.class === FLIP_CLASS){
              checkTheseCards.push(someCard);
            }
        }
        let firstCard = null;
        let secondCard = null;
        for (const [key, card] of Object.entries(checkTheseCards)){
          if (parseInt(key) === 0){
            firstCard = card;
          } 
          if (parseInt(key) === 1){
            secondCard = card;
          }
        }
        
        // CHECKING CARDS
        let match = null;
        if (firstCard !== null && secondCard !== null){
          if (firstCard.data === secondCard.data){
            match = true;
          } else {
            match = false;
          }
        }

        // MATCH HANDLING
        if (match){
          switchClassOnCards(FLIP_CLASS, MATCH_CLASS)
          this.changeScore(SCORE_MOD_PLUS);
          this.setState({matches: this.state.matches + 1});
          if (this.state.matches === MATCHES_TO_WIN){
            this.updateBestScore(this.state.score + SCORE_MOD_PLUS);
            if (DEBUG_MODE) {outputLocalStorage();}
          }
        } else {
          BOARD_LOCKED = true;
          this.changeScore(SCORE_MOD_MINUS);
          setTimeout(() => {
            this.setState({freezeCards:true});
            BOARD_LOCKED = false;
            }, SHOW_SECOND_CARD_TIME);          
        }
        
        this.setState({click:1});
      }
    }
  
    changeScore(value){
      if (value > 0) {
        this.setState({score: this.state.score + value});
      } else {
        this.setState({score: this.state.score - Math.abs(value)});
      }
    }

    updateBestScore(yourScore){
      if (parseInt(yourScore) > this.state.bestScore){
        this.setState({bestScore: parseInt(yourScore)});
        localStorage.setItem("bestScoreFor_" + GAME_DECK.length / 2, yourScore.toString());
      }
    }

    render(){
      if (this.state.freezeCards === true){
        switchClassOnCards(FLIP_CLASS, DEFAULT_CLASS)
        this.setState({freezeCards: false});
      }

      return(
        <div id="game">
          <div id="score-block">CURRENT SCORE: <span id="score">{this.state.score}</span></div>
          <div id="best-score-block">BEST SCORE ({this.state.gameMode} pairs): <span id="best-score">{this.state.bestScore}</span></div>
          <div id="new-game-block">
            <form id="bar" onSubmit={this.newGame}>
              <select id="gamemode" name="gamemode">
                <option value="24">24 pairs</option>
                <option value="12">12 pairs</option>
                <option value="6">6 pairs</option>
              </select>
              <input id="new-game" type="submit" value="NEW GAME" />
              <input id="clear-best" type="button" value="CLEAR BEST" onClick={this.clearBestScores} />
            </form>
          </div>
          <Board 
            GAME_DECK={GAME_DECK}
            boardSize={GAME_DECK.length / 2}
            clickHandler={this.clickHandler}
            DEBUG_MODE={DEBUG_MODE}
          />

        </div>
      );
    }
  }

  export default Game;