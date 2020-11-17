import React from "react";
import Card from './Card';

class Board extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        click:1,
        previousCard:null
      }
      this.boardHandler = this.boardHandler.bind(this);
    }
  
    boardHandler(card){
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
    
  
    render(){
      let CARDS = this.props.CARDS;
      let MATCHES_TO_WIN = CARDS.length / 2;

      return( CARDS.map((card,index) => (
        <Card 
          index={index} 
          path={card.path} 
          data={card.data} 
          id={card.id} 
          key={index} 
          boardHandler={this.boardHandler} 
          updateScore={this.props.updateScore}
          updateBestScore={this.props.updateBestScore} 
          MATCHES_TO_WIN={MATCHES_TO_WIN} 
          matchCounter={this.props.matchCounter}
        />
        ))
      );
    }
  }

  export default Board;