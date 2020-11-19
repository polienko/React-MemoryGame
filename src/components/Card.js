import React from "react";
import img_cover from "../img/cover.png";
import './Card.css';

class Card extends React.Component{
    constructor(props){
      super(props);
      this.state = {
      }
      this.cardHandler = this.cardHandler.bind(this);
    }

    cardHandler(){
      this.props.clickHandler(this);
    }

    render(){
      return(
        <div className={this.props.class} key={this.props.index} onClick={this.cardHandler} >
          <img className="card-front" alt="" src={this.props.path} data-card={this.props.data} draggable="false" />
          {this.props.DEBUG_MODE ? 
          <img className="card-back" alt="" src={this.props.path} alt="" data-card={this.props.data} draggable="false" /> :
          <img className="card-back" alt="" src={img_cover} alt="" data-card={this.props.data} draggable="false" />
          }
        </div>
      );
    }
  }

  export default Card;