import React from "react";

import img_cover from "../img/cover.png";

const SHOW_SECOND_CARD_TIME = 500;
const SCORE_PLUS = 50;
const SCORE_MINUS = -10;

let BOARD_LOCKED = false;

class Card extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        MATCHES_TO_WIN: this.props.MATCHES_TO_WIN,
        class: "card",
      }
      this.cardHandler = this.cardHandler.bind(this);
    }
    
    cardHandler(){
      if (this.state.class === "card match" || this.state.class === "card flip") {
        return "CAN'T CLICK ON CARD";
      } 
      if (BOARD_LOCKED){
        return "CAN'T CLICK ON CARD";
      }
  
      let boardHandlerResult = this.props.boardHandler(this);
  
      if (boardHandlerResult === "FIRST CARD"){
        this.state.class === "card" ? this.setState({class:"card flip"}) : this.setState({class:this.state.class});
      } else if (typeof boardHandlerResult === 'object' && boardHandlerResult !== null) {
        let previousCard = boardHandlerResult;
        if (previousCard.props.data === this.props.data) {
          previousCard.setState({class:"card match"});
          this.setState({class:"card match"});
          this.props.updateScore(SCORE_PLUS);
          
          if (this.props.matchCounter() === this.state.MATCHES_TO_WIN){
            let currentScore = parseInt(document.getElementById("score").innerText) + SCORE_PLUS;
            if (currentScore > parseInt(localStorage.getItem(this.state.MATCHES_TO_WIN))){
              console.log("current is bigger than "+localStorage.getItem(this.state.MATCHES_TO_WIN));
              localStorage.setItem(this.state.MATCHES_TO_WIN,currentScore);
              this.props.updateBestScore(currentScore);
            }
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
          <img className="card-front" alt="" src={this.props.path} data-card={this.props.data} draggable="false" />
          <img className="card-back" alt="" src={this.props.path} alt="" data-card={this.props.data} draggable="false" />
        </div>
      );
    }
  }

  export default Card;