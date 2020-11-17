import React from "react";
import Board from './Board';

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

if (sessionStorage.getItem('score') == null){
    sessionStorage.setItem('score',"")
}
/* // NOT USED BECAUSE OF IMPORTED RESOURCES
function insertCardPairInDeck(arrayToPush, i){
  let newCardObj1 = {}
  newCardObj1.path = "img_" + i.toString();
  newCardObj1.data = i.toString();
  newCardObj1.id = i.toString() + "a";
  let newCardObj2 = {}
  newCardObj2.path = "img_" + i.toString();
  newCardObj2.data = i.toString();
  newCardObj2.id = i.toString() + "b";
  arrayToPush.push(newCardObj1,newCardObj2);
  return arrayToPush;
}

let CARD_DECK = [];
for (let i = 0; i < 11; i++) {
  insertCardPairInDeck(CARD_DECK, i);
}
console.log(CARD_DECK);
*/

let CARD_DECK = [
    {path:img_1, data:"1", id:"1a"},
    {path:img_1, data:"1", id:"1b"},
    {path:img_2, data:"2", id:"2a"},
    {path:img_2, data:"2", id:"2b"},
    {path:img_3, data:"3", id:"3a"},
    {path:img_3, data:"3", id:"3b"},
    {path:img_4, data:"4", id:"4a"},
    {path:img_4, data:"4", id:"4b"},

  ];

function shuffleCards(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

let CARDS = CARD_DECK.slice(0,8);
CARDS = shuffleCards(CARDS);
let defaultGameMode = CARDS.length / 2;

//localStorage.clear(); //FOR DEBUG PURPOSES

if (localStorage.getItem(defaultGameMode) === null){
  localStorage.setItem(defaultGameMode,"0");
}

class Game extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        score:0,
        gameCount:0,
        gameMode:CARDS.length / 2,
        bestScore:localStorage.getItem(defaultGameMode),
        MATCH_COUNTER: 1,
        CARDS: CARDS
      }

      this.updateScore = this.updateScore.bind(this);
      this.updateBestScore = this.updateBestScore.bind(this);
      this.newGame = this.newGame.bind(this);
      this.matchCounter = this.matchCounter.bind(this);

      console.log("----------------- localStorage");
      for (let i = 0; i < localStorage.length; i++){
        console.log(localStorage.key(i) + "=" + localStorage.getItem(localStorage.key(i)) + "");
      }
      console.log("----------------- localStorage");       
    }
    
    newGame(event){
      event.preventDefault();
      let newGameMode = event.target.elements['gamemode'].value;
      CARDS = CARD_DECK.slice(0,newGameMode*2);
      CARDS = shuffleCards(CARDS);

      this.setState({gameCount: this.state.gameCount + 1});
      this.setState({gameMode: CARDS.length / 2});
      this.setState({score: 0});
      this.setState({MATCH_COUNTER: 1});
      this.setState({CARDS:CARDS})
      if (localStorage.getItem(newGameMode) === null){
        localStorage.setItem(newGameMode,"0");
        this.setState({bestScore: localStorage.getItem(newGameMode)});
      } else {
        this.setState({bestScore: localStorage.getItem(newGameMode)});
      }

      console.log("----------------- localStorage");
      for (let i = 0; i < localStorage.length; i++){
        console.log(localStorage.key(i) + "=" + localStorage.getItem(localStorage.key(i)) + "");
      }
      console.log("----------------- localStorage");      
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
      }
    }

    matchCounter(){
      this.setState({MATCH_COUNTER: this.state.MATCH_COUNTER + 1});
      console.log("matches:"+this.state.MATCH_COUNTER);
      return(this.state.MATCH_COUNTER);
    }
  
    render(){
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
          <div id="board">
            <Board 
              key={this.state.gameCount}
              updateScore={this.updateScore}
              updateBestScore={this.updateBestScore}
              CARDS={this.state.CARDS}
              matchCounter={this.matchCounter}
            />
          </div>
        </div>
      );
    }
  }

  export default Game;