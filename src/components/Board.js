import React from "react";
import Card from './Card';
import './Board.css';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <div id={"board_"+this.props.boardSize} key={this.state.gameID}>
        {this.props.GAME_DECK.map((card, index) => (
          <Card
            key={index}
            index={index}
            data={card.data}
            class={card.class}
            path={card.path}
            clickHandler={this.props.clickHandler}
            DEBUG_MODE={this.props.DEBUG_MODE}
          />
        ))}
      </div>
    );
  }
}

export default Board;

