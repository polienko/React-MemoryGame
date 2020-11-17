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

let CARD_DECK = [
  {data:"1", match:false, path:img_1},
  {data:"2", match:false, path:img_2},
  {data:"3", match:false, path:img_3},
  {data:"4", match:false, path:img_4},
  {data:"5", match:false, path:img_5},
  {data:"6", match:false, path:img_6},
  {data:"7", match:false, path:img_7},
  {data:"8", match:false, path:img_8},
  {data:"9", match:false, path:img_9},
  {data:"10", match:false, path:img_10},
];

let DOUBLE_DECK = [];
CARD_DECK.map((card) => (DOUBLE_DECK.push(card,card)));

let CARDS = DOUBLE_DECK.slice(0,8);
CARDS = shuffleCards(CARDS);

let defaultGameMode = CARDS.length / 2;

//localStorage.clear(); //FOR DEBUG PURPOSES

if (localStorage.getItem(defaultGameMode) === null){
  localStorage.setItem(defaultGameMode,"0");
}

function shuffleCards(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class Game extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        score:0,
        gameID:0,
        gameMode:CARDS.length / 2,
        bestScore:localStorage.getItem(defaultGameMode),
        MATCH_COUNTER: 1,
        CARDS: CARDS,
        previousCard:null,
        click:1
      }
      console.log(this.state.CARDS);
      this.updateScore = this.updateScore.bind(this);
      this.updateBestScore = this.updateBestScore.bind(this);
      this.newGame = this.newGame.bind(this);
      this.matchCounter = this.matchCounter.bind(this);   
      this.clickHandler = this.clickHandler.bind(this);   
    }
    
    newGame(event){
      event.preventDefault();
      let newGameMode = event.target.elements['gamemode'].value;

      CARDS = DOUBLE_DECK.slice(0,newGameMode*2);
      CARDS = shuffleCards(CARDS);

      this.setState({gameID: this.state.gameID + 1});
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
    }

    clickHandler(card){
      console.log(this.state.previousCard);
      this.setState({previousCard: card});
      console.log(card);

      this.setState({click: this.state.click + 1});
      console.log("click:"+this.state.click);
  
      this.setState({previousCard: card});
      
      if (this.state.click === 1){
        return "FIRST CARD";
      } else if (this.state.click === 2) {
        this.setState({click:1});
        return this.state.previousCard;
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
      }
    }

    matchCounter(){
      this.setState({MATCH_COUNTER: this.state.MATCH_COUNTER + 1});
      console.log("matches:"+this.state.MATCH_COUNTER);
      return(this.state.MATCH_COUNTER);
    }
  
    render(){
      let MATCHES_TO_WIN = CARDS.length / 2;
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
              index={index}
              match={card.match}
              path={card.path} 
              data={card.data} 
              id={card.id} 
              updateScore={this.updateScore}
              updateBestScore={this.updateBestScore} 
              MATCHES_TO_WIN={MATCHES_TO_WIN} 
              matchCounter={this.matchCounter}
              clickHandler={this.clickHandler}
            />
            ))}            
          </div>
        </div>
      );
    }
  }

  export default Game;