import React from "react";
import Card from './Card';

import img_1 from "../img/1.png";
import img_2 from "../img/2.png";
import img_3 from "../img/3.png";
import img_4 from "../img/4.png";
import img_5 from "../img/5.png";
import img_6 from "../img/6.png";
import img_7 from "../img/7.png";
import img_8 from "../img/8.png";
import img_9 from "../img/9.png";
import img_10 from "../img/10.png";

const SHOW_SECOND_CARD_TIME = 500;

const DEFAULT_CLASS = "card";
const MATCH_CLASS = "card match";
const FLIP_CLASS = "card flip";

let BOARD_LOCKED = false;

const SCORE_MOD_PLUS = 50;
const SCORE_MOD_MINUS = -10;

let CARD_DECK = [
  {data:"1", class:DEFAULT_CLASS, path:img_1},
  {data:"2", class:DEFAULT_CLASS, path:img_2},
  {data:"3", class:DEFAULT_CLASS, path:img_3},
  {data:"4", class:DEFAULT_CLASS, path:img_4},
  {data:"5", class:DEFAULT_CLASS, path:img_5},
  {data:"6", class:DEFAULT_CLASS, path:img_6},
  {data:"7", class:DEFAULT_CLASS, path:img_7},
  {data:"8", class:DEFAULT_CLASS, path:img_8},
  {data:"9", class:DEFAULT_CLASS, path:img_9},
  {data:"10", class:DEFAULT_CLASS, path:img_10},
];

let DOUBLE_DECK = [];
CARD_DECK.map((card) => (DOUBLE_DECK.push(card, Object.assign({}, card))));

let CARDS = DOUBLE_DECK.slice(0,8);
CARDS = shuffleCards(CARDS);

let MATCHES_TO_WIN = CARDS.length / 2;
let DEFAULT_GAMEMODE = CARDS.length / 2;

//localStorage.clear(); //FOR DEBUG PURPOSES

if (localStorage.getItem(DEFAULT_GAMEMODE) === null){
  localStorage.setItem(DEFAULT_GAMEMODE,"0");
}

function shuffleCards(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function switchClassOnAllCards(from,to){
  for (const [key, someCard] of Object.entries(CARDS)){
    if (someCard.class === from){
      someCard.class = to;
    }
  }
}

function resetClassOnAllCards(){
  for (const [key, someCard] of Object.entries(CARDS)){
    someCard.class = DEFAULT_CLASS;
  }
}

function switchClassToFlipped(clickedCard){
  for (const [key, someCard] of Object.entries(CARDS)){
    if(parseInt(key) === parseInt(clickedCard.props.index)){
      if (someCard.class === DEFAULT_CLASS){
        someCard.class = FLIP_CLASS;
      }
    }
  }
}

function outputLocalStorage(){
  console.log("------- localStorage:");
  for (let i = 0; i < localStorage.length; i++){
    console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
  }
}

class Game extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        gameID:0,
        score:0,
        bestScore:localStorage.getItem(DEFAULT_GAMEMODE),
        gameMode:CARDS.length / 2,
        matches: 1,
        click:1,
        freezeCards:false
      }
      console.log(this.state.CARDS);
      this.updateScore = this.updateScore.bind(this);
      this.updateBestScore = this.updateBestScore.bind(this);
      this.newGame = this.newGame.bind(this);   
      this.clickHandler = this.clickHandler.bind(this);   

      outputLocalStorage();
    }

    newGame(event){
      event.preventDefault();
      let newGameMode = event.target.elements['gamemode'].value;

      resetClassOnAllCards();
      CARDS = DOUBLE_DECK.slice(0,newGameMode*2);
      CARDS = shuffleCards(CARDS);
      MATCHES_TO_WIN = CARDS.length / 2;

      this.setState({gameID: this.state.gameID + 1});
      this.setState({gameMode: CARDS.length / 2});
      this.setState({score: 0});
      this.setState({matches: 1});
      this.setState({CARDS:CARDS})
      if (localStorage.getItem(newGameMode) === null){
        localStorage.setItem(newGameMode,"0");
        this.setState({bestScore: localStorage.getItem(newGameMode)});
      } else {
        this.setState({bestScore: localStorage.getItem(newGameMode)});
      }
      outputLocalStorage();
    }

    clickHandler(clickedCard){
      if (clickedCard.props.class === MATCH_CLASS){
        return "CAN'T CLICK ON CARD";
      }
      if (clickedCard.props.class === FLIP_CLASS){
        return "CAN'T CLICK ON CARD";
      } 
      if (BOARD_LOCKED){
        return "CAN'T CLICK ON CARD";
      }

      this.setState({click: this.state.click + 1});

      switchClassToFlipped(clickedCard);
      
      if (this.state.click === 2) {
        let checkTheseCards=[];
        for (const [key, someCard] of Object.entries(CARDS)){
            if (someCard.class === FLIP_CLASS){
              checkTheseCards.push(someCard);
            }
        }

        // ADD CARDS TO CHECK
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
          switchClassOnAllCards(FLIP_CLASS, MATCH_CLASS)
          this.updateScore(SCORE_MOD_PLUS);
          this.setState({matches: this.state.matches + 1});
          if (this.state.matches === MATCHES_TO_WIN){
            this.updateBestScore(this.state.score + SCORE_MOD_PLUS);
            outputLocalStorage();
          }
        } else {
          BOARD_LOCKED = true;
          this.updateScore(SCORE_MOD_MINUS);
          setTimeout(() => {
            this.setState({freezeCards:true});
            BOARD_LOCKED = false;
            }, SHOW_SECOND_CARD_TIME);          
        }
        
        this.setState({click:1});
      }
    }
  
    updateScore(value){
      if (value > 0) {
        this.setState({score: this.state.score + value});
      } else {
        this.setState({score: this.state.score - Math.abs(value)});
      }
    }

    updateBestScore(yourScore){
      if (parseInt(yourScore) > this.state.bestScore){
        this.setState({bestScore: parseInt(yourScore)});
        localStorage.setItem(CARDS.length / 2,yourScore.toString());
      }
    }

    render(){
      if (this.state.freezeCards === true){
        switchClassOnAllCards(FLIP_CLASS, DEFAULT_CLASS)
        this.setState({freezeCards: false});
      }

      return(
        <div id="game">
          <div id="score-block">CURRENT SCORE: <span id="score">{this.state.score}</span></div>
          <div id="best-score-block">BEST SCORE ({this.state.gameMode} pairs): <span id="best-score">{this.state.bestScore}</span></div>
          <div id="new-game-block">
            <form id="bar" onSubmit={this.newGame}>
              <select id="gamemode" name="gamemode">
                <option value="4">4 pairs</option>
                <option value="6">6 pairs</option>
                <option value="8">8 pairs</option>
                <option value="10">10 pairs</option>
              </select>
              <input id="new-game" type="submit" value="NEW" />
            </form>
          </div>
          <div id="board" key={this.state.gameID}>
            {CARDS.map((card,index) => (
            <Card 
              key={index}
              clickHandler={this.clickHandler}
              index={index}
              data={card.data}
              class={card.class}
              path={card.path}
            />
            ))}            
          </div>
        </div>
      );
    }
  }

  export default Game;