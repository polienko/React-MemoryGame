import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
//import App from './App';
import img_cover from "./img/cover.png";
import img_1 from "./img/1.png";
import img_2 from "./img/2.png";
import img_3 from "./img/3.png";
import img_4 from "./img/4.png";
import img_5 from "./img/5.png";
import img_6 from "./img/6.png";
import img_7 from "./img/7.png";
import img_8 from "./img/8.png";


const SHOW_SECOND_CARD_TIME = 500;
const SCORE_PLUS = 50;
const SCORE_MINUS = -10;

let BOARD_LOCKED = false;

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

let CARDS = CARD_DECK.slice(0,16);
let MATCHES_TO_WIN = CARDS.length / 2;
let MATCH_COUNTER = 0;

function shuffleCards(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

if (sessionStorage.getItem('score') == null){
  sessionStorage.setItem('score',"")
}

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      score:0,
      gameCount:0
    }
    this.updateScore = this.updateScore.bind(this);
    this.newGame = this.newGame.bind(this);
    shuffleCards(CARDS);
  }
  
  newGame(event){
    event.preventDefault();
    let gamemode = event.target.elements['gamemode'].value * 2;
    CARDS = CARD_DECK.slice(0,gamemode);
    MATCHES_TO_WIN = CARDS.length / 2;
    console.log(CARDS);
    this.setState({gameCount: this.state.gameCount + 1});
    this.setState({score:0});
    MATCH_COUNTER = 0;
    shuffleCards(CARDS);
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
          <Board updateScore={this.updateScore} key={this.state.gameCount}/>
        </div>
      </div>
    );
  }
}

class Board extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      clickCounter:0,
      previousCard:""
    }
    this.boardHandler = this.boardHandler.bind(this);
  }

  boardHandler(card){
    this.state.clickCounter = this.state.clickCounter + 1;

    this.setState({previousCard: card});
    
    if (this.state.clickCounter == 1){
      return "FIRST CARD";
    } else if (this.state.clickCounter == 2) {
      this.setState({clickCounter:0});
      if (this.state.previousCard.props.data == card.props.data && this.state.previousCard.props.id != card.props.id) {
        return this.state.previousCard; // MATCH -> return PREV CARD
      } else {
        return this.state.previousCard; // NOT MATCH -> return PREV CARD
      }
    }
  }

  render(){
    return(   
      CARDS.map((card,index) => (
          <Card index={index} path={card.path} data={card.data} id={card.id} 
          key={index} boardHandler={this.boardHandler} updateScore={this.props.updateScore} /> 
          ))
    );
  }
}

class Card extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      class: "card"
    }
    this.cardHandler = this.cardHandler.bind(this);
  }
  cardHandler(){
    if (this.state.class == "card match" || this.state.class == "card flip") {
      return "CAN'T CLICK ON CARD";
    } 
    if (BOARD_LOCKED){
      return "CAN'T CLICK ON CARD";
    }

    let boardHandlerResult = this.props.boardHandler(this);

    if (boardHandlerResult == "FIRST CARD"){
      this.state.class == "card" ? this.setState({class:"card flip"}) : this.setState({class:this.state.class});
    } else if (typeof boardHandlerResult === 'object' && boardHandlerResult !== null) {
      let previousCard = boardHandlerResult;
      if (previousCard.props.data == this.props.data) {
        previousCard.setState({class:"card match"});
        this.setState({class:"card match"});
        this.props.updateScore(SCORE_PLUS);
        MATCH_COUNTER += 1;
        if (MATCH_COUNTER == MATCHES_TO_WIN){
          let currentScore = parseInt(document.getElementById("score").innerText) + SCORE_PLUS;
          if (sessionStorage.getItem('score') == ""){
            sessionStorage.setItem('score', currentScore);
          } else {
            sessionStorage.setItem('score', sessionStorage.getItem('score') + ";" + currentScore);
          }
          console.log("SCORE: "+sessionStorage.getItem('score'));
        }
      } else {
        BOARD_LOCKED = true;
        this.setState({class:"card flip"});
        this.props.updateScore(SCORE_MINUS);
        setTimeout(() => {
          previousCard.setState({class:"card"}); 
          this.setState({class:"card"});
          BOARD_LOCKED = false;
          }, SHOW_SECOND_CARD_TIME);
      }
    }
  }
  render(){
    return(
      <div className={this.state.class} key={this.props.index} onClick={this.cardHandler} >
        <img className="card-front" src={this.props.path} data-card={this.props.data} draggable="false" />
        <img className="card-back" src={img_cover} alt="" data-card={this.props.data} draggable="false" />
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));