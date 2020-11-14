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

if (sessionStorage.getItem('score') == null){
    sessionStorage.setItem('score',"")
}

let CARD_DECK = [
    {path:img_1, data:"1", id:"1a"},
    {path:img_1, data:"1", id:"1b"},
    {path:img_2, data:"2", id:"2a"},
    {path:img_2, data:"2", id:"2b"},
    {path:img_3, data:"3", id:"3a"},
    {path:img_3, data:"3", id:"3b"},
    {path:img_4, data:"4", id:"4a"},
    {path:img_4, data:"4", id:"4b"},
    {path:img_5, data:"5", id:"5a"},
    {path:img_5, data:"5", id:"5b"},
    {path:img_6, data:"6", id:"6a"},
    {path:img_6, data:"6", id:"6b"},
    {path:img_7, data:"7", id:"7a"},
    {path:img_7, data:"7", id:"7b"},
    {path:img_8, data:"8", id:"8a"},
    {path:img_8, data:"8", id:"8b"},
  ];

function shuffleCards(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

let CARDS = CARD_DECK.slice(0,16);
shuffleCards(CARDS);

class Game extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        score:0,
        gameCount:0,
        MATCH_COUNTER: 0,
        CARDS: {CARDS}
      }
      this.updateScore = this.updateScore.bind(this);
      this.newGame = this.newGame.bind(this);
    }
    
    newGame(event){
      event.preventDefault();
      let gamemode = event.target.elements['gamemode'].value * 2;
      CARDS = CARD_DECK.slice(0,gamemode);
      console.log(this.state.CARDS);
      this.setState({gameCount: this.state.gameCount + 1});
      this.setState({score:0});
      this.state.MATCH_COUNTER = 0;
      shuffleCards(CARDS);
      this.setState({CARDS:{CARDS}})
    }
  
    updateScore(value){
      if (value > 0) {
        this.setState({score: this.state.score + value});
      } else {
        this.setState({score: this.state.score - Math.abs(value)});
      }
    }
  
    render(){
      return(
        <div id="game">
          <div id="score-block">SCORE:<span id="score">{this.state.score}</span></div>
          <div id="new-game-block">
            <form onSubmit={this.newGame}>
              <select name="gamemode">
                <option value="8">8 pairs</option>
                <option value="6">6 pairs</option>
                <option value="4">4 pairs</option>
              </select>
              <input type="submit" value="NEW" />
            </form>
          </div>
          <br />
          <div id="board">
            <Board updateScore={this.updateScore} 
            key={this.state.gameCount} CARDS={this.state.CARDS}
            MATCH_COUNTER={this.state.MATCH_COUNTER}/>
          </div>
        </div>
      );
    }
  }

  export default Game;