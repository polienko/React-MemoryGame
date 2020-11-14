import React from "react";
import Card from './Card';

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
      
      if (this.state.clickCounter === 1){
        return "FIRST CARD";
      } else if (this.state.clickCounter === 2) {
        this.setState({clickCounter:0});
        if (this.state.previousCard.props.data === card.props.data && this.state.previousCard.props.id !== card.props.id) {
          return this.state.previousCard; // MATCH -> return PREV CARD
        } else {
          return this.state.previousCard; // NOT MATCH -> return PREV CARD
        }
      }
    }
  
    render(){
      let CARDS = this.props.CARDS.CARDS;
      return( CARDS.map((card,index) => (
        <Card index={index} path={card.path} data={card.data} id={card.id} 
        key={index} boardHandler={this.boardHandler} updateScore={this.props.updateScore} 
        CARDS={CARDS} MATCH_COUNTER={this.props.MATCH_COUNTER} />
        ))
      );
    }
  }

  export default Board;