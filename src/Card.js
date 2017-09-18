import React, { Component } from 'react';
import CheckList from './CheckList.js';
import marked from 'marked'; //library to render markdown https://github.com.chjj/marked

class Card extends Component {
  constructor() {
    super(...arguments);
    this.state={
      showDetails: false
    };

  }
  toggleDetails() {
    this.setState({showDetails: !this.state.showDetails});
  }
// conditional render
  render() {
    let cardDetails;
  {/* inline style*/}
    let sideColor = {
      position: 'absolute',
      zIndex: -1,
      top: 0,
      bottom: 0,
      left: 0,
      width: 7,
      backgroundColor: this.props.color
    };

    if (this.state.showDetails) {
      cardDetails = (
          <div className="card_details">
      {/* pass jsx expression into marked(), use dangerouslySetInnerHTML to render html in JSX*/}
          <span dangerouslySetInnerHTML={{__html:marked(this.props.description)}}/>
          <CheckList cardId={this.props.id} tasks={this.props.tasks} />
        </div>

        );
    };
    return (
      <div className="card">
       <div style={sideColor} />
        <div className={this.state.showDetails ? "card_title card_title--is-open" : "card_title"} onClick={this.toggleDetails.bind(this)}>
          {this.props.title}
          </div>
        {cardDetails}
      </div>
    );
  }
}

export default Card;
